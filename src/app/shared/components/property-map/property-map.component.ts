import {
  Component,
  Input,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  ElementRef,
  ViewChild,
  PLATFORM_ID,
  inject,
  SimpleChanges,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface MapMarker {
  lat: number;
  lng: number;
  title?: string;
  price?: string;
}

// Direct leaflet import — avoid Angular wrapper libraries like ngx-leaflet
// that lag behind releases and add unnecessary complexity
@Component({
  selector: 'app-property-map',
  imports: [],
  template: `<div #mapContainer data-testid="property-map" class="w-full rounded-xl overflow-hidden" [style.height]="height"></div>`,
})
export class PropertyMapComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) lat!: number;
  @Input({ required: true }) lng!: number;
  @Input() title = '';
  @Input() zoom = 14;
  @Input() height = '320px';
  @Input() markers: MapMarker[] = [];
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private leaflet: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private markerLayer: any;

  private createMarkerIcon() {
    return this.leaflet.divIcon({
      className: 'property-map-marker-icon',
      html: [
        '<span class="property-map-marker">',
        '<span class="property-map-marker__pin">',
        '<span class="property-map-marker__dot"></span>',
        '</span>',
        '</span>',
      ].join(''),
      iconSize: [24, 32],
      iconAnchor: [12, 30],
      popupAnchor: [0, -28],
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isBrowser || !this.map) return;

    if (changes['lat'] || changes['lng'] || changes['markers'] || changes['zoom']) {
      this.renderMarkers();
    }
  }

  private async initMap(): Promise<void> {
    // Lazy-load leaflet — reduces initial bundle size
    const L = await import('leaflet');
    this.leaflet = L;

    this.map = L.map(this.mapContainer.nativeElement).setView([this.lat, this.lng], this.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(this.map);

    this.renderMarkers();
    setTimeout(() => this.map?.invalidateSize(), 0);
  }

  private renderMarkers(): void {
    if (!this.map || !this.leaflet) return;

    const L = this.leaflet;

    if (this.markerLayer) {
      this.markerLayer.remove();
    }

    const markersToAdd = this.markers.length > 0
      ? this.markers
      : [{ lat: this.lat, lng: this.lng, title: this.title }];
    this.markerLayer = L.featureGroup();
    const markerIcon = this.createMarkerIcon();

    for (const m of markersToAdd) {
      const marker = L.marker([m.lat, m.lng], { icon: markerIcon });
      if (m.title || m.price) {
        marker.bindPopup(`<strong>${m.title ?? ''}</strong>${m.price ? `<br>${m.price}` : ''}`);
      }
      marker.addTo(this.markerLayer);
    }

    this.markerLayer.addTo(this.map);

    if (markersToAdd.length > 1) {
      this.map.fitBounds(this.markerLayer.getBounds(), {
        padding: [24, 24],
        maxZoom: this.zoom,
      });
    } else {
      this.map.setView([markersToAdd[0].lat, markersToAdd[0].lng], this.zoom);
    }

    setTimeout(() => this.map?.invalidateSize(), 0);
  }

  ngOnDestroy(): void {
    this.markerLayer?.remove();
    this.map?.remove();
  }
}

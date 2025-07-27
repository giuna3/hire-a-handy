import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

/// <reference types="google.maps" />

interface MapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string | number;
    position: { lat: number; lng: number };
    title: string;
    info?: string;
    type?: 'provider' | 'job';
    onClick?: () => void;
  }>;
  onMapClick?: (position: { lat: number; lng: number }) => void;
  onLocationFound?: (position: { lat: number; lng: number }) => void;
  className?: string;
}

const GoogleMap: React.FC<MapProps> = ({
  center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  zoom = 12,
  markers = [],
  onMapClick,
  onLocationFound,
  className = "w-full h-full"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const userLocationMarkerRef = useRef<google.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>('');
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    const initializeMap = async () => {
      // Google Maps API key
      const apiKey = 'AIzaSyCRysTXZ4jz8b-8xFJr-T2LGSZCNLlPG-w';
      
      if (!apiKey) {
        setError('Google Maps API key not configured');
        return;
      }

      try {
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();
        
        if (!mapRef.current) return;

        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        mapInstanceRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();

        // Add click listener
        if (onMapClick) {
          map.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
              onMapClick({
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
              });
            }
          });
        }

        setIsLoaded(true);
        setError('');
      } catch (err) {
        setError('Failed to load Google Maps. Please check your API key.');
        console.error('Google Maps loading error:', err);
      }
    };

    initializeMap();
  }, [center.lat, center.lng, zoom, onMapClick]);

  // Update markers when markers prop changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    markers.forEach(markerData => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map: mapInstanceRef.current,
        title: markerData.title,
        icon: {
          url: markerData.type === 'job' 
            ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#10B981" stroke="white" stroke-width="2"/>
                  <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">$</text>
                </svg>
              `)
            : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#EF4444" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="10" r="3" fill="white"/>
                  <path d="M7 18c0-2.5 2.25-4.5 5-4.5s5 2 5 4.5" stroke="white" stroke-width="2" fill="none"/>
                </svg>
              `),
          scaledSize: new google.maps.Size(32, 32)
        }
      });

      // Add click listener for marker
      marker.addListener('click', () => {
        if (markerData.info && infoWindowRef.current) {
          infoWindowRef.current.setContent(`
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold;">${markerData.title}</h3>
              <p style="margin: 0; color: #666;">${markerData.info}</p>
            </div>
          `);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        }
        
        if (markerData.onClick) {
          markerData.onClick();
        }
      });

      markersRef.current.push(marker);
    });
  }, [markers, isLoaded]);

  // Function to get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        // Center map on user location
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(userLocation);
          mapInstanceRef.current.setZoom(15);
          
          // Remove existing user location marker
          if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.setMap(null);
          }

          // Add user location marker
          userLocationMarkerRef.current = new google.maps.Marker({
            position: userLocation,
            map: mapInstanceRef.current,
            title: 'Your Location',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#3B82F6" stroke="white" stroke-width="3"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 24)
            }
          });
        }

        // Call the callback if provided
        if (onLocationFound) {
          onLocationFound(userLocation);
        }

        setLocationLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Unable to get your location. Please check location permissions.');
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted rounded-lg`}>
        <div className="text-center p-8">
          <p className="text-destructive mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Get your API key from{' '}
            <a 
              href="https://console.cloud.google.com/google/maps-apis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Cloud Console
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Location Controls */}
      {isLoaded && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={getCurrentLocation}
            disabled={locationLoading}
            className="bg-white/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg hover:bg-white/95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Find my location"
          >
            {locationLoading ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
            )}
          </button>
        </div>
      )}
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
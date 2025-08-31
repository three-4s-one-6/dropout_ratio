'use client';

import AppLayout from '@/components/Layout/AppLayout';
import { MigrationMapProvider } from '@/providers/MigrationMapProvider';
import { FilterProvider } from '@/providers/FilterProvider';

export default function HomePage() {
  return (
    <FilterProvider>
      <MigrationMapProvider baseLayer="satellite">
        <AppLayout />
      </MigrationMapProvider>
    </FilterProvider>
  );
}
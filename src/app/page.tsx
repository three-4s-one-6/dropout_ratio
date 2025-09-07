'use client';

import AppLayout from '@/components/Layout/AppLayout';
import { MigrationMapProvider } from '@/providers/MigrationMapProvider';
import { FilterProvider } from '@/providers/FilterProvider';
import { MigrationDataProvider } from '@/providers/MigrationDataProvider';

export default function HomePage() {
  return (
    <FilterProvider>
      <MigrationDataProvider>
        <MigrationMapProvider baseLayer="satellite">
          <AppLayout />
        </MigrationMapProvider>
      </MigrationDataProvider>
    </FilterProvider>
  );
}
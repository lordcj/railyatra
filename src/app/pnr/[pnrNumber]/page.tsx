import { Metadata } from 'next';
import { generatePNRMetadata } from '@/lib/seo/metadata';
import PNRResultClient from './PNRResultClient';

// Allow dynamic params
export const dynamicParams = true;

// Generate metadata
export async function generateMetadata({ params }: { params: Promise<{ pnrNumber: string }> }): Promise<Metadata> {
    const { pnrNumber } = await params;
    return generatePNRMetadata(pnrNumber);
}

export default async function PNRPage() {
    return <PNRResultClient />;
}

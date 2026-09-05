// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import IntelligencePortal from './IntelligencePortal';
import { intelligenceApi } from './api';
vi.mock('./api',()=>({intelligenceApi:{summary:vi.fn(),consents:vi.fn(),request:vi.fn(),diagnostics:vi.fn()}}));
const summary={generatedAt:'2026-09-05T12:00:00Z',enabledDomains:[],counts:{events:0,projections:0,predictions:0,recommendations:0,resolved:0},artifacts:[],readiness:[],versions:[],preferences:{},sourceStatus:[],quality:null};
beforeEach(()=>{cleanup();vi.resetAllMocks();vi.mocked(intelligenceApi.summary).mockResolvedValue(summary as never);vi.mocked(intelligenceApi.consents).mockResolvedValue([{domain:'money',enabled:false,purpose:'Personal decision support'}]);vi.mocked(intelligenceApi.request).mockResolvedValue({admin:false});});
describe('Intelligence product gates',()=>{
 it('starts opt-in with no invented predictions or administrator controls',async()=>{render(<MemoryRouter initialEntries={['/app/intelligence']}><IntelligencePortal/></MemoryRouter>);await screen.findByText('Intelligence is opt-in. Enable a domain to begin.');expect(screen.queryByText('Administration')).toBeNull();expect(screen.getByText('No eligible records yet')).toBeTruthy();});
 it('persists the selected domain without silently enabling cross-domain use',async()=>{render(<MemoryRouter initialEntries={['/app/intelligence/privacy']}><IntelligencePortal/></MemoryRouter>);const checkbox=await screen.findByRole('checkbox',{name:'money'});fireEvent.click(checkbox);await waitFor(()=>expect(intelligenceApi.request).toHaveBeenCalledWith('/consents','PUT',{domain:'money',enabled:true}));});
 it('requires an exact deletion phrase before exposing the destructive action',async()=>{render(<MemoryRouter initialEntries={['/app/intelligence/delete']}><IntelligencePortal/></MemoryRouter>);const button=await screen.findByRole('button',{name:'Delete derived data'});expect((button as HTMLButtonElement).disabled).toBe(true);fireEvent.change(screen.getByLabelText('Type DELETE INTELLIGENCE'),{target:{value:'DELETE INTELLIGENCE'}});expect((button as HTMLButtonElement).disabled).toBe(false);});
 it('reports backend failure and offers retry',async()=>{vi.mocked(intelligenceApi.summary).mockRejectedValue(new Error('Service unavailable'));render(<MemoryRouter initialEntries={['/app/intelligence']}><IntelligencePortal/></MemoryRouter>);expect(await screen.findByText('Service unavailable')).toBeTruthy();expect(screen.getByRole('button',{name:'Retry loading'})).toBeTruthy();});
});

import type { Repo } from './types';

const DESCRIPTIONS: Record<string, string> = {
  LinqContraband:
    'Roslyn analyser for EF Core queries: catches N+1 patterns and client-side evaluation before they ship.',
  ConfigContraband:
    'Roslyn analysers for .NET Options and appsettings, so broken configuration does not wait for deploy day.',
  'DependencyInjection.Lifetime.Analyzers':
    'Zero-overhead Roslyn analyser for captive dependencies, leaked scopes and DI lifetime mismatches.',
  'automapper-analyser':
    'Roslyn analyser for AutoMapper maps, catching missing and misconfigured mappings at build time.',
  CPMigrate:
    'CLI for moving .NET solutions to NuGet Central Package Management, with dependency checks and rollback.',
  NotifyGen:
    'C# source generator for INotifyPropertyChanged boilerplate. Add [Notify], get the property wiring.',
  'CancelCop.Analyzer':
    'Roslyn analyser for CancellationToken propagation across handlers, EF Core, HTTP and Minimal APIs.',
  'HttpClient.Resilience.Analyzers':
    'Roslyn analysers for HttpClient lifetime, outbound resilience, response ownership and safe retries.',
  CQRSPrototype:
    'Clean-architecture CQRS reference using MediatR, DDD and the transactional outbox pattern.',
};

export function repoDescription(repo: Pick<Repo, 'name' | 'description'>): string {
  return DESCRIPTIONS[repo.name] ?? repo.description ?? '—';
}

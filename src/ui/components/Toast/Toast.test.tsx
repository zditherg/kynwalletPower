import { render, screen } from '@testing-library/react';
import { expectNoA11yViolations } from '@/test/a11y';
import { Toast } from './Toast';

describe('Toast (US3, FR-013, FR-016)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('US3-1: renderiza el mensaje con role="status" y aria-live="polite"', () => {
    render(<Toast message="Próximamente" onDismiss={vi.fn()} />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Próximamente');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('US3-3: se oculta automáticamente tras durationMs (3000 ms por defecto)', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast message="Próximamente" onDismiss={onDismiss} />);
    vi.advanceTimersByTime(2999);
    expect(onDismiss).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('FR-016: sin violaciones de accesibilidad axe', async () => {
    const { container } = render(<Toast message="Próximamente" onDismiss={vi.fn()} />);
    await expectNoA11yViolations(container);
  });
});

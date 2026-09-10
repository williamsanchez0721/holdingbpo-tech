export function confirmPinMatchUseCase(pin: string, confirmationPin: string): boolean {
  return pin === confirmationPin;
}

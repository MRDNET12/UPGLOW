'use client';

interface TrialExtensionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export function TrialExtensionPopup({ isOpen, onClose, theme = 'light' }: TrialExtensionPopupProps) {
  // DÉSACTIVÉ - Popup d'extension d'essai supprimé sur demande
  return null;
}

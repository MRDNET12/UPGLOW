'use client';

interface SubscriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthDialog?: () => void;
  source?: 'button' | 'trial_expired';
}

export function SubscriptionPopup({ isOpen, onClose, source = 'trial_expired' }: SubscriptionPopupProps) {
  // DÉSACTIVÉ - Popup d'abonnement supprimé sur demande
  return null;
}

"use client";

import { useEffect, useState } from "react";
import AgeGate from "./AgeGate";
import MusicConsentModal from "./MusicConsentModal";

/**
 * Orchestration Age Gate → consentement musique, deux préoccupations indépendantes :
 * - l'Age Gate n'est jamais mémorisé : elle s'affiche obligatoirement à chaque
 *   nouveau chargement complet du site, avant tout contenu ;
 * - le choix musical (sessionStorage) est demandé juste après, une fois par
 *   session, afin que le clic sur « Activer l'ambiance » serve de geste
 *   utilisateur pour l'autoplay.
 *
 * On rend donc "fermé" au premier passage (identique au SSR, pas de flash) puis
 * on affiche l'Age Gate dans un effet de montage côté client.
 */
export default function IntroFlow() {
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- affichage obligatoire au montage, seul moyen d'éviter un mismatch d'hydratation SSR/CSR.
    setShowAgeGate(true);
  }, []);

  return (
    <>
      {showAgeGate && <AgeGate onValidated={() => setShowMusicModal(true)} />}
      {showMusicModal && <MusicConsentModal onDismiss={() => setShowMusicModal(false)} />}
    </>
  );
}

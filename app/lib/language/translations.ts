export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export interface Translations {
  seo: {
    title: string;
    description: string;
  };
  nav: {
    logoAria: string;
    links: { href: string; label: string }[];
    reserve: string;
    languageLabel: string;
    switchToFr: string;
    switchToEn: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    paragraph: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scrollLabel: string;
    scrollAria: string;
    slideAlts: string[];
  };
  about: {
    eyebrow: string;
    title: string;
    paragraph: string;
    quote: string;
    cta: string;
    items: { title: string; content: string }[];
  };
  ageGate: {
    eyebrow: string;
    title: string;
    subtitle: string;
    paragraph: string;
    confirmIntro: string;
    confirmItems: string[];
    enter: string;
    leave: string;
    consent: string;
  };
  musicConsent: {
    title: string;
    paragraph: string;
    activate: string;
    decline: string;
  };
  audioPlayer: {
    activateAria: string;
    muteAria: string;
    srMuted: string;
    srActive: string;
  };
}

export const TRANSLATIONS: Record<Locale, Translations> = {
  fr: {
    seo: {
      title: "Elite One Spa | Expérience Sensuelle Haut de Gamme à Montréal",
      description:
        "Elite One Spa offre une expérience de massage haut de gamme à Montréal dans un environnement élégant, discret et réservé aux adultes.",
    },
    nav: {
      logoAria: "Elite One Spa — Accueil",
      links: [
        { href: "#accueil", label: "Accueil" },
        { href: "#soins", label: "Nos soins" },
        { href: "#reservation", label: "Réservation" },
      ],
      reserve: "Réserver",
      languageLabel: "Choisir la langue",
      switchToFr: "Passer en français",
      switchToEn: "Switch to English",
    },
    hero: {
      eyebrow: "L’art du bien-être absolu",
      titleLine1: "Une parenthèse d’exception",
      titleLine2: "pour le corps et l’esprit",
      paragraph:
        "Rituels sur-mesure, gestes d’exception et matières précieuses — Elite One Spa réinvente le luxe du soin dans un écrin d’intimité absolue.",
      ctaPrimary: "Réserver une séance",
      ctaSecondary: "Découvrir nos soins",
      scrollLabel: "Défiler",
      scrollAria: "Défiler pour découvrir la suite",
      slideAlts: [
        "Suite de soin Elite One Spa baignée d'une lumière tamisée et dorée",
        "Espace détente Elite One Spa aux teintes chaleureuses et feutrées",
        "Cabine de soin Elite One Spa à l'ambiance feutrée et raffinée",
        "Univers Elite One Spa empreint de sérénité et d'élégance discrète",
      ],
    },
    about: {
      eyebrow: "L’expérience Elite One",
      title: "Bien plus qu’un massage",
      paragraph:
        "Elite One Spa offre une expérience privée alliant bien-être, sensualité, élégance et discrétion. Chaque visite est pensée pour offrir un moment d’évasion dans un cadre raffiné.",
      quote: "Un instant à part. Entièrement consacré à vous.",
      cta: "Découvrir nos soins",
      items: [
        {
          title: "Hôtesses élégantes et sensuelles",
          content:
            "Un accueil incarné par des hôtesses raffinées, choisies pour leur élégance naturelle et leur sens du détail, afin de sublimer chaque instant de votre visite.",
        },
        {
          title: "Corps à corps",
          content:
            "Un rituel enveloppant où la proximité devient le langage du bien-être, dans une atmosphère intime et parfaitement maîtrisée.",
        },
        {
          title: "Douceur au toucher",
          content:
            "Des gestes délicats et enveloppants, pensés pour apaiser le corps et libérer l’esprit dans une lenteur assumée.",
        },
        {
          title: "Triangle amoureux",
          content:
            "Une expérience à trois temps, orchestrée avec subtilité pour explorer de nouvelles harmonies sensorielles.",
        },
        {
          title: "Rain on Me",
          content:
            "Une pluie fine et chaude accompagne le soin, pour une sensation d’abandon total, entre eau et sensualité.",
        },
      ],
    },
    ageGate: {
      eyebrow: "Accès réservé",
      title: "Bienvenue chez Elite One Spa",
      subtitle: "Avertissement — contenu réservé aux adultes",
      paragraph:
        "Les pages de ce site sont réservées aux adultes et peuvent contenir du contenu pouvant offenser certaines personnes. Si vous avez moins de 18 ans, si ce contenu vous offense ou est interdit dans votre région, veuillez quitter ce site.",
      confirmIntro: "En entrant, vous confirmez :",
      confirmItems: [
        "J’ai 18 ans ou plus.",
        "J’assume l’entière responsabilité de mes actions.",
        "J’accepte d’être légalement lié par les présentes conditions d’utilisation.",
      ],
      enter: "Entrer",
      leave: "Quitter le site",
      consent:
        "En entrant, vous confirmez avoir au moins 18 ans et acceptez nos conditions d’utilisation et notre politique de confidentialité.",
    },
    musicConsent: {
      title: "Souhaitez-vous activer l’ambiance sonore ?",
      paragraph: "Une bande sonore immersive accompagne l’expérience Elite One Spa.",
      activate: "Activer l’ambiance",
      decline: "Continuer sans musique",
    },
    audioPlayer: {
      activateAria: "Activer l'ambiance sonore",
      muteAria: "Couper l'ambiance sonore",
      srMuted: "Musique d'ambiance coupée",
      srActive: "Musique d'ambiance activée",
    },
  },
  en: {
    seo: {
      title: "Elite One Spa | Luxury Sensual Experience in Montreal",
      description:
        "Elite One Spa offers a premium massage experience in Montreal within an elegant, discreet, adults-only environment.",
    },
    nav: {
      logoAria: "Elite One Spa — Home",
      links: [
        { href: "#accueil", label: "Home" },
        { href: "#soins", label: "Treatments" },
        { href: "#reservation", label: "Booking" },
      ],
      reserve: "Book",
      languageLabel: "Select language",
      switchToFr: "Passer en français",
      switchToEn: "Switch to English",
    },
    hero: {
      eyebrow: "The art of absolute well-being",
      titleLine1: "An exceptional escape",
      titleLine2: "for body and mind",
      paragraph:
        "Bespoke rituals, exceptional gestures and precious materials — Elite One Spa reinvents the luxury of care within a haven of absolute intimacy.",
      ctaPrimary: "Book a Session",
      ctaSecondary: "Discover Our Treatments",
      scrollLabel: "Scroll",
      scrollAria: "Scroll to discover more",
      slideAlts: [
        "Elite One Spa treatment suite bathed in soft, golden light",
        "Elite One Spa relaxation space in warm, muted tones",
        "Elite One Spa treatment room with a hushed, refined ambiance",
        "The Elite One Spa world, steeped in serenity and quiet elegance",
      ],
    },
    about: {
      eyebrow: "The Elite One Experience",
      title: "More than a massage",
      paragraph:
        "Elite One Spa offers a private experience blending well-being, sensuality, elegance and discretion. Every visit is designed as a moment of escape within a refined setting.",
      quote: "A moment apart. Entirely devoted to you.",
      cta: "Discover Our Treatments",
      items: [
        {
          title: "Elegant, Sensual Hostesses",
          content:
            "A welcome embodied by refined hostesses, chosen for their natural elegance and attention to detail, to elevate every moment of your visit.",
        },
        {
          title: "Body to Body",
          content:
            "An enveloping ritual where closeness becomes the language of well-being, within a perfectly composed, intimate atmosphere.",
        },
        {
          title: "Gentle Touch",
          content:
            "Delicate, enveloping gestures designed to soothe the body and free the mind, in an unhurried, deliberate rhythm.",
        },
        {
          title: "Love Triangle",
          content:
            "A three-part experience, subtly orchestrated to explore new sensory harmonies.",
        },
        {
          title: "Rain on Me",
          content:
            "A warm, fine rain accompanies the treatment, for a feeling of total surrender, between water and sensuality.",
        },
      ],
    },
    ageGate: {
      eyebrow: "Restricted Access",
      title: "Welcome to Elite One Spa",
      subtitle: "Adult Content Disclaimer",
      paragraph:
        "This website is intended for adults only and may contain material some viewers may find offensive. If you are under 18, if this content offends you, or if it is illegal in your region, please leave this website.",
      confirmIntro: "By entering you confirm:",
      confirmItems: [
        "I am 18 years of age or older.",
        "I accept full responsibility for my own actions.",
        "I agree to be legally bound by these Terms and Conditions.",
      ],
      enter: "Enter",
      leave: "Leave site",
      consent:
        "By entering, you confirm that you are at least 18 years old and agree to our Terms of Use and Privacy Policy.",
    },
    musicConsent: {
      title: "Would you like to enable the ambient sound?",
      paragraph: "An immersive soundtrack accompanies the Elite One Spa experience.",
      activate: "Enable Sound",
      decline: "Continue Without Music",
    },
    audioPlayer: {
      activateAria: "Enable ambient sound",
      muteAria: "Mute ambient sound",
      srMuted: "Ambient music muted",
      srActive: "Ambient music enabled",
    },
  },
};

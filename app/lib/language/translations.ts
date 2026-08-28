export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export interface Translations {
  seo: {
    title: string;
    description: string;
  };
  nav: {
    skipToContent: string;
    logoAria: string;
    links: { href: string; label: string }[];
    reserve: string;
    languageLabel: string;
    switchToFr: string;
    switchToEn: string;
    menuOpenAria: string;
    menuCloseAria: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    paragraph: string;
    addressLabel: string;
    addressLine: string;
    addressAria: string;
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
    paragraph2: string;
    paragraph3: string;
    quote: string;
    cta: string;
    readMore: string;
    readLess: string;
    /** Short 2–4 line teaser shown on the mobile treatments cards — a
     *  dedicated field (not a truncation of `content`) so the mobile DOM
     *  never has to carry, clamp, or hide the long-form description. */
    items: { title: string; content: string; summary: string }[];
  };
  hostesses: {
    eyebrow: string;
    title: string;
    subtitle: string;
    statusBar: {
      live: string;
      available: string;
      comingSoon: string;
      offToday: string;
      updatedJustNow: string;
      updatedMinutesAgo: string;
    };
    filters: {
      all: string;
      available: string;
      comingSoon: string;
      offToday: string;
      premium: string;
      newArrival: string;
    };
    status: {
      available: string;
      comingSoon: string;
      off: string;
    };
    badges: {
      popular: string;
      newArrival: string;
      staffFavorite: string;
      premium: string;
    };
    featuredBadge: string;
    ratingLabel: string;
    bookNow: string;
    bookAria: string;
    viewProfile: string;
    viewProfileAria: string;
    showMore: string;
    showMoreAria: string;
    /** Shown on the mobile filtered list when a filter matches zero hostesses. */
    noResults: string;
    placeholder: {
      title: string;
      subtitle: string;
    };
    stats: {
      age: string;
      height: string;
      weight: string;
      measurements: string;
      ageUnit: string;
    };
    modal: {
      closeAria: string;
      galleryLabel: string;
      galleryComingSoon: string;
      descriptionLabel: string;
      languagesLabel: string;
      servicesLabel: string;
      availabilityLabel: string;
      locationLabel: string;
      bookAppointment: string;
      bookAppointmentAria: string;
      lightboxOpenAria: string;
      lightboxPreviousAria: string;
      lightboxNextAria: string;
    };
    /** Shown on every hostess card/modal — a single spa-wide value, not per-hostess data (that all lives in Sanity now). */
    location: string;
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    minutesLabel: string;
    twoHandsLabel: string;
    fourHandsLabel: string;
    ctaBook: string;
    bookAria: string;
    popularBadge: string;
    cards: {
      duration: string;
      description: string;
      priceTwo: string;
      priceFour: string;
    }[];
  };
  hiring: {
    eyebrow: string;
    title: string;
    paragraph: string;
    paragraph2: string;
    highlights: { title: string; description: string }[];
    note: string;
    form: {
      title: string;
      subtitle: string;
      fields: {
        fullName: { label: string; placeholder: string };
        ageConfirm: { label: string };
        phone: { label: string; placeholder: string };
        email: { label: string; placeholder: string };
        availability: { label: string; placeholder: string };
        experience: { label: string; placeholder: string; optionalTag: string };
        message: { label: string; placeholder: string };
        consent: { label: string };
      };
      errors: {
        required: string;
        ageRequired: string;
        consentRequired: string;
        invalidEmail: string;
        invalidPhone: string;
      };
      submit: string;
      submitting: string;
      successTitle: string;
      successMessage: string;
      resetCta: string;
    };
  };
  contact: {
    badge: string;
    number: string;
    numberHref: string;
    subtitle: string;
    callAria: string;
    bookNow: string;
    walkInLine1: string;
    walkInLine2: string;
    bookAria: string;
  };
  contactSection: {
    eyebrow: string;
    title: string;
    paragraph: string;
    form: {
      fields: {
        fullName: { label: string; placeholder: string };
        phone: { label: string; placeholder: string };
        email: { label: string; placeholder: string };
        subject: { label: string; placeholder: string };
        message: { label: string; placeholder: string };
      };
      errors: {
        required: string;
        invalidEmail: string;
        invalidPhone: string;
      };
      submit: string;
    };
    mapTitle: string;
    openInMaps: string;
    openInMapsAria: string;
    addressAria: string;
    hoursLabel: string;
    ageLabel: string;
  };
  footer: {
    logoAria: string;
    tagline: string;
    contactTitle: string;
    address: string;
    addressAria: string;
    email: string;
    emailAria: string;
    hoursLabel: string;
    hoursValue: string;
    linksTitle: string;
    links: {
      treatments: string;
      availability: string;
      hiring: string;
      contact: string;
      privacy: string;
      terms: string;
    };
    trustTitle: string;
    trust: {
      rating: string;
      discreet: string;
      downtown: string;
      adultsOnly: string;
      openDaily: string;
    };
    bookAppointment: string;
    bookAppointmentAria: string;
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
      skipToContent: "Aller au contenu principal",
      logoAria: "Elite One Spa — Accueil",
      links: [
        { href: "#accueil", label: "Accueil" },
        { href: "#apropos", label: "Expérience" },
        { href: "#hotesses", label: "Disponibilités" },
        { href: "#soins", label: "Services & Tarifs" },
        { href: "#carrieres", label: "Recrutement" },
        { href: "#contact", label: "Contact" },
      ],
      reserve: "Sans rendez-vous",
      languageLabel: "Choisir la langue",
      switchToFr: "Passer en français",
      switchToEn: "Switch to English",
      menuOpenAria: "Ouvrir le menu",
      menuCloseAria: "Fermer le menu",
    },
    hero: {
      eyebrow: "L’art du bien-être absolu",
      titleLine1: "Une parenthèse d’exception",
      titleLine2: "pour le corps et l’esprit",
      paragraph:
        "Rituels sur-mesure, gestes d’exception et matières précieuses — Elite One Spa réinvente le luxe du soin dans un écrin d’intimité absolue.",
      addressLabel: "Présentez-vous directement",
      addressLine: "1621 boul. Saint-Laurent, Montréal, QC",
      addressAria: "Ouvrir l’adresse d’Elite One Spa dans Google Maps",
      ctaPrimary: "Sans rendez-vous",
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
      paragraph2:
        "Dans un cadre intime et soigneusement pensé, chaque détail contribue à votre confort : une ambiance feutrée, une discrétion absolue et une attention entièrement personnalisée. Vous n’êtes jamais un client parmi d’autres, mais l’unique invité d’un moment conçu pour vous.",
      paragraph3:
        "Chaque rituel est exécuté avec la précision d’un savoir-faire rare, où l’exigence du geste rencontre une chaleur sincère — une signature qui distingue véritablement Elite One Spa.",
      quote: "Un instant à part. Entièrement consacré à vous.",
      cta: "Découvrir nos soins",
      readMore: "Lire la suite",
      readLess: "Réduire",
      items: [
        {
          title: "Hôtesses élégantes et sensuelles",
          content:
            "Dès votre arrivée, vous êtes accueilli par des hôtesses élégantes et sensuelles, choisies pour leur grâce naturelle et leur attention sincère. Leur présence donne le ton à toute la visite — raffinée, posée et entièrement tournée vers vous. Chaque geste et chaque parole sont guidés par la discrétion et une élégance tranquille, façonnant une expérience personnalisée où vous vous sentez véritablement considéré, choyé et libre de vous abandonner à l’instant.",
          summary:
            "Un accueil raffiné par des hôtesses choisies pour leur grâce et leur discrétion. Le ton de toute votre visite, entièrement tourné vers vous.",
        },
        {
          title: "Corps à corps",
          content:
            "Une expérience de bien-être complet, profondément relaxante, entièrement construite autour de la proximité et de la chaleur. Des mouvements fluides et continus parcourent le corps de la tête aux pieds, dissolvant les tensions et invitant au lâcher-prise. Peau contre peau, le rituel se déploie lentement et intuitivement, mêlant confort et sensualité dans une atmosphère de confiance totale. Plus qu’une technique, c’est un rythme partagé, pensé pour vous laisser léger, présent et parfaitement apaisé.",
          summary:
            "Un massage complet, fluide et enveloppant, de la tête aux pieds. Peau contre peau, dans une confiance totale, pour un moment de pur lâcher-prise.",
        },
        {
          title: "Douceur au toucher",
          content:
            "Une expérience plus douce et contemplative, pensée pour celles et ceux qui recherchent avant tout le calme. Des gestes délicats et des mouvements lents et posés s’unissent pour apaiser l’esprit et détendre le corps. Ici, rien ne presse — seulement une atmosphère paisible, une chaleur enveloppante et l’espace nécessaire pour respirer profondément et laisser chaque muscle se relâcher. Une invitation à l’immobilité, un moment de pure sérénité, à l’écart du rythme du quotidien.",
          summary:
            "Une expérience douce et contemplative, aux gestes lents et posés. Une invitation au calme, loin du rythme du quotidien.",
        },
        {
          title: "Triangle amoureux",
          content:
            "Une expérience immersive partagée avec deux hôtesses, dont l’attention coordonnée crée une dynamique rarement égalée. Leur complicité naturelle et leur rythme parfaitement accordé transforment la rencontre en un moment riche et captivant, chaque geste répondant à l’autre avec subtilité et intention. Entouré d’une attention totale venue de deux directions à la fois, vous êtes porté dans un moment pleinement partagé — intense, élégant et sans équivalent.",
          summary:
            "Une expérience immersive avec deux hôtesses, à l’attention parfaitement accordée. Un moment intense, élégant et sans équivalent.",
        },
        {
          title: "Rain on Me",
          content:
            "Un rituel chaleureux inspiré de la pluie, où de fins filets d’eau ruissellent délicatement sur la peau, préparant le corps à une relaxation totale. Associée à un toucher tout en douceur, la sensation de l’eau éveille chaque terminaison nerveuse, dissipant les tensions tout en réveillant les sens. Dans une atmosphère privée et tamisée, ce rituel joue sur les contrastes — la chaleur de l’eau, la douceur du toucher et l’intimité discrète d’être entièrement pris en charge.",
          summary:
            "Un rituel inspiré de la pluie, où l’eau ruisselle délicatement sur la peau. Une relaxation totale dans une ambiance privée et tamisée.",
        },
      ],
    },
    hostesses: {
      eyebrow: "Disponibilités en direct",
      title: "Qui est disponible maintenant",
      subtitle: "Disponibilités mises à jour en temps réel.",
      statusBar: {
        live: "En direct",
        available: "hôtesses disponibles",
        comingSoon: "bientôt disponibles",
        offToday: "absentes aujourd’hui",
        updatedJustNow: "Mise à jour à l’instant",
        updatedMinutesAgo: "Mise à jour il y a {n} min",
      },
      filters: {
        all: "Toutes",
        available: "Disponible maintenant",
        comingSoon: "Bientôt disponible",
        offToday: "Absente aujourd’hui",
        premium: "Premium",
        newArrival: "Nouveau",
      },
      status: {
        available: "Disponible maintenant",
        comingSoon: "Bientôt disponible",
        off: "Absente aujourd’hui",
      },
      badges: {
        popular: "Populaire aujourd’hui",
        newArrival: "Nouvelle arrivée",
        staffFavorite: "Coup de cœur",
        premium: "Premium",
      },
      featuredBadge: "En direct",
      ratingLabel: "sur 5",
      bookNow: "Réserver maintenant",
      bookAria: "Réserver une séance avec {name}",
      viewProfile: "Voir le profil",
      viewProfileAria: "Voir le profil de {name}",
      showMore: "Voir plus d’hôtesses",
      showMoreAria: "Afficher les hôtesses supplémentaires",
      noResults: "Aucune hôtesse ne correspond à ce filtre pour le moment.",
      placeholder: {
        title: "Portrait premium à venir",
        subtitle: "Portrait officiel disponible après approbation de la direction.",
      },
      stats: {
        age: "Âge",
        height: "Grandeur",
        weight: "Poids",
        measurements: "Mensurations",
        ageUnit: "ans",
      },
      modal: {
        closeAria: "Fermer le profil",
        galleryLabel: "Galerie",
        galleryComingSoon: "Photos à venir",
        descriptionLabel: "À propos",
        languagesLabel: "Langues parlées",
        servicesLabel: "Services proposés",
        availabilityLabel: "Disponibilité",
        locationLabel: "Quartier",
        bookAppointment: "Sans rendez-vous",
        bookAppointmentAria: "Réserver un rendez-vous avec {name}",
        lightboxOpenAria: "Agrandir la photo {n}",
        lightboxPreviousAria: "Photo précédente",
        lightboxNextAria: "Photo suivante",
      },
      location: "Centre-ville de Montréal",
    },
    services: {
      eyebrow: "Notre carte de soins",
      title: "Services & Tarifs",
      subtitle: "Ouvert 7 jours sur 7",
      minutesLabel: "minutes",
      twoHandsLabel: "Deux mains",
      fourHandsLabel: "Quatre mains",
      ctaBook: "Sans rendez-vous",
      bookAria: "Réserver l’expérience de {duration} minutes",
      popularBadge: "Le plus demandé",
      cards: [
        {
          duration: "30",
          description:
            "Une immersion rapide et intense, pensée pour se recentrer sans compromis sur l’excellence du geste.",
          priceTwo: "40 $",
          priceFour: "80 $",
        },
        {
          duration: "45",
          description:
            "L’équilibre parfait entre profondeur et disponibilité, pour un moment pleinement savouré.",
          priceTwo: "50 $",
          priceFour: "100 $",
        },
        {
          duration: "60",
          description:
            "L’expérience signature Elite One, dans toute sa plénitude et sa générosité.",
          priceTwo: "80 $",
          priceFour: "160 $",
        },
      ],
    },
    hiring: {
      eyebrow: "Rejoignez notre équipe",
      title: "Un lieu de travail raffiné",
      paragraph:
        "Elite One Spa est à la recherche d’hôtesses professionnelles, fiables et respectueuses pour se joindre à une équipe soudée, dans un cadre élégant et bienveillant.",
      paragraph2:
        "Ce poste est réservé exclusivement aux candidates de 18 ans et plus, sans exception.",
      highlights: [
        {
          title: "Environnement sécuritaire et respectueux",
          description:
            "Une équipe attentive et un cadre pensé pour votre sécurité et votre bien-être, en tout temps.",
        },
        {
          title: "Confidentialité et discrétion",
          description: "Votre vie privée est protégée avec la plus grande rigueur, à chaque étape.",
        },
        {
          title: "Horaires flexibles",
          description: "Des disponibilités adaptées à votre réalité, sans contrainte rigide.",
        },
        {
          title: "Formation et accompagnement",
          description: "Un encadrement complet dès votre arrivée, et un soutien continu par la suite.",
        },
        {
          title: "Limites personnelles respectées",
          description: "Vos limites et votre consentement sont toujours prioritaires, sans exception.",
        },
        {
          title: "Aucune pression, aucun jugement",
          description:
            "Vous avancez à votre rythme, dans un climat de confiance et de respect mutuel.",
        },
      ],
      note: "Les candidatures sont confidentielles et étudiées avec discrétion.",
      form: {
        title: "Postuler maintenant",
        subtitle: "Quelques minutes suffisent.",
        fields: {
          fullName: { label: "Nom complet", placeholder: "Votre nom et prénom" },
          ageConfirm: { label: "Je confirme avoir 18 ans ou plus" },
          phone: { label: "Téléphone", placeholder: "(514) 000-0000" },
          email: { label: "Courriel", placeholder: "vous@exemple.com" },
          availability: { label: "Disponibilités", placeholder: "Ex. soirs, fins de semaine" },
          experience: {
            label: "Expérience précédente",
            placeholder: "Parlez-nous brièvement de votre parcours",
            optionalTag: "Facultatif",
          },
          message: {
            label: "Message / présentation",
            placeholder: "Présentez-vous en quelques mots",
          },
          consent: { label: "J’accepte d’être contactée au sujet de ma candidature" },
        },
        errors: {
          required: "Ce champ est requis.",
          ageRequired: "Vous devez confirmer avoir 18 ans ou plus pour postuler.",
          consentRequired: "Veuillez accepter d’être contactée pour continuer.",
          invalidEmail: "Veuillez entrer une adresse courriel valide.",
          invalidPhone: "Veuillez entrer un numéro de téléphone valide.",
        },
        submit: "Envoyer ma candidature",
        submitting: "Ouverture de votre messagerie…",
        successTitle: "Client de messagerie ouvert",
        successMessage:
          "Votre client de messagerie s’est ouvert avec votre candidature déjà rédigée. Il ne vous reste qu’à cliquer sur Envoyer pour nous la faire parvenir.",
        resetCta: "Envoyer une autre candidature",
      },
    },
    contact: {
      badge: "Contact 24/7",
      number: "514 543 8344",
      numberHref: "+15145438344",
      subtitle: "Rendez-vous privés • Service discret • Centre-ville de Montréal",
      callAria: "Appeler Elite One Spa au 514 543 8344",
      bookNow: "Sans rendez-vous",
      walkInLine1: "Aucune réservation requise.",
      walkInLine2: "Présentez-vous directement sur place.",
      bookAria: "Réserver une séance chez Elite One Spa",
    },
    contactSection: {
      eyebrow: "Prenez contact",
      title: "Contactez Elite One Spa",
      paragraph:
        "Chaque demande est traitée avec la plus grande discrétion. Que ce soit pour réserver une séance privée ou simplement poser une question, notre équipe vous répond rapidement et en toute confidentialité.",
      form: {
        fields: {
          fullName: { label: "Nom complet", placeholder: "Votre nom et prénom" },
          phone: { label: "Téléphone", placeholder: "(514) 000-0000" },
          email: { label: "Courriel", placeholder: "vous@exemple.com" },
          subject: { label: "Sujet", placeholder: "Ex. Réservation, question générale" },
          message: { label: "Message", placeholder: "Écrivez votre message ici…" },
        },
        errors: {
          required: "Ce champ est requis.",
          invalidEmail: "Veuillez entrer une adresse courriel valide.",
          invalidPhone: "Veuillez entrer un numéro de téléphone valide.",
        },
        submit: "Envoyer le message",
      },
      mapTitle: "Localisation d’Elite One Spa sur Google Maps",
      openInMaps: "Ouvrir dans Google Maps",
      openInMapsAria: "Ouvrir Elite One Spa dans Google Maps",
      addressAria: "Ouvrir l’adresse d’Elite One Spa dans Google Maps",
      hoursLabel: "Ouvert 7 jours sur 7",
      ageLabel: "Réservé aux 18 ans et plus",
    },
    footer: {
      logoAria: "Elite One Spa — Accueil",
      tagline:
        "Elite One Spa propose une expérience privée et raffinée au cœur de Montréal. Chaque visite est pensée autour de la discrétion, du confort et d’une attention personnalisée, dans un cadre élégant réservé aux adultes. Notre équipe s’engage à créer une atmosphère accueillante où chaque invité peut se détendre, décrocher et savourer un moment entièrement consacré à son bien-être.",
      contactTitle: "Nous joindre",
      address: "1621 boul. Saint-Laurent, Montréal, QC",
      addressAria: "Ouvrir l’adresse d’Elite One Spa dans Google Maps",
      email: "info@eliteonespa.ca",
      emailAria: "Envoyer un courriel à Elite One Spa",
      hoursLabel: "Horaires",
      hoursValue: "Ouvert 7 jours sur 7",
      linksTitle: "Liens rapides",
      links: {
        treatments: "Soins",
        availability: "Disponibilités",
        hiring: "Carrières",
        contact: "Contact",
        privacy: "Politique de confidentialité",
        terms: "Conditions d’utilisation",
      },
      trustTitle: "L’expérience Elite One",
      trust: {
        rating: "4.9/5 — Expérience client",
        discreet: "Service discret",
        downtown: "Centre-ville de Montréal",
        adultsOnly: "Réservé aux 18 ans et plus",
        openDaily: "Ouvert 7 jours sur 7",
      },
      bookAppointment: "Sans rendez-vous",
      bookAppointmentAria: "Réserver un rendez-vous chez Elite One Spa",
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
      skipToContent: "Skip to main content",
      logoAria: "Elite One Spa — Home",
      links: [
        { href: "#accueil", label: "Home" },
        { href: "#apropos", label: "Experience" },
        { href: "#hotesses", label: "Availability" },
        { href: "#soins", label: "Services & Rates" },
        { href: "#carrieres", label: "Hiring" },
        { href: "#contact", label: "Contact" },
      ],
      reserve: "Walk-In Only",
      languageLabel: "Select language",
      switchToFr: "Passer en français",
      switchToEn: "Switch to English",
      menuOpenAria: "Open menu",
      menuCloseAria: "Close menu",
    },
    hero: {
      eyebrow: "The art of absolute well-being",
      titleLine1: "An exceptional escape",
      titleLine2: "for body and mind",
      paragraph:
        "Bespoke rituals, exceptional gestures and precious materials — Elite One Spa reinvents the luxury of care within a haven of absolute intimacy.",
      addressLabel: "Come directly to our location",
      addressLine: "1621 Saint-Laurent Blvd, Montreal, QC",
      addressAria: "Open Elite One Spa's address in Google Maps",
      ctaPrimary: "Walk-In Only",
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
      paragraph2:
        "Within an intimate, carefully considered setting, every detail is designed for your comfort — a private ambiance, absolute discretion and attention that is entirely personalized. You are never simply a guest among others, but the sole focus of a moment created just for you.",
      paragraph3:
        "Every ritual is delivered with the precision of a rare craft, where exacting technique meets genuine warmth — a signature that truly sets Elite One Spa apart.",
      quote: "A moment apart. Entirely devoted to you.",
      cta: "Discover Our Treatments",
      readMore: "Read more",
      readLess: "Show less",
      items: [
        {
          title: "Elegant, Sensual Hostesses",
          content:
            "From the moment you arrive, you are welcomed by elegant, sensual hostesses chosen for their natural grace and genuine attentiveness. Their presence sets a refined, unhurried tone, entirely focused on you. Every gesture and every word are guided by discretion and quiet elegance, shaping a personalized experience where you feel truly seen, cared for and free to relax into the moment.",
          summary:
            "A refined welcome from hostesses chosen for their grace and discretion. Their presence sets the tone for a visit entirely focused on you.",
        },
        {
          title: "Body to Body",
          content:
            "A deeply relaxing full-body experience built entirely around closeness and warmth. Fluid, continuous movements flow from head to toe, dissolving tension and inviting you to simply let go. Skin against skin, the ritual unfolds slowly and intuitively, blending comfort with sensuality in an atmosphere of complete trust. It is less a technique than a shared rhythm — one designed to leave you feeling weightless, present and entirely at ease.",
          summary:
            "A deeply relaxing full-body massage, fluid and enveloping. Skin against skin, in complete trust, for a moment of pure release.",
        },
        {
          title: "Soft Touch",
          content:
            "A softer, more contemplative experience for those seeking calm above all else. Delicate gestures and slow, deliberate movements work together to quiet the mind and soothe the body. There is no rush here — only a peaceful atmosphere, gentle warmth and the space to breathe deeply and let every muscle unwind. It is an invitation to stillness, a moment of pure serenity set apart from the pace of everyday life.",
          summary:
            "A gentle, contemplative experience of slow, deliberate movements. An invitation to stillness, set apart from the pace of everyday life.",
        },
        {
          title: "Love Triangle",
          content:
            "An immersive experience shared with two hostesses, whose coordinated attention creates a dynamic rarely found elsewhere. Their natural chemistry and effortless rhythm turn the encounter into something layered and captivating, each movement responding to the other with subtlety and intent. Surrounded by undivided focus from two directions at once, you are drawn into a fully shared moment — intense, elegant and unlike any solo experience.",
          summary:
            "An immersive experience with two hostesses, their attention perfectly in sync. An intense, elegant moment unlike any other.",
        },
        {
          title: "Rain on Me",
          content:
            "A warm, shower-inspired ritual where fine streams of water cascade gently over the skin, setting the stage for total relaxation. Combined with gentle touch, the sensation of water heightens every nerve ending, washing away tension while awakening the senses. Set within a private, softly lit atmosphere, this ritual is a study in contrast — the warmth of water, the softness of touch, and the quiet intimacy of being entirely looked after.",
          summary:
            "A shower-inspired ritual where water cascades gently over the skin. Total relaxation within a private, softly lit atmosphere.",
        },
      ],
    },
    hostesses: {
      eyebrow: "Live Availability",
      title: "Who’s Available Now",
      subtitle: "Live availability updated in real time.",
      statusBar: {
        live: "Live Now",
        available: "Hostesses Available",
        comingSoon: "Coming Soon",
        offToday: "Off Today",
        updatedJustNow: "Updated just now",
        updatedMinutesAgo: "Updated {n} min ago",
      },
      filters: {
        all: "All",
        available: "Available Now",
        comingSoon: "Coming Soon",
        offToday: "Off Today",
        premium: "Premium",
        newArrival: "New",
      },
      status: {
        available: "Available Now",
        comingSoon: "Coming Soon",
        off: "Off Today",
      },
      badges: {
        popular: "Popular Today",
        newArrival: "New Arrival",
        staffFavorite: "Staff Favorite",
        premium: "Premium",
      },
      featuredBadge: "Live",
      ratingLabel: "out of 5",
      bookNow: "Book Now",
      bookAria: "Book a session with {name}",
      viewProfile: "View Profile",
      viewProfileAria: "View {name}'s profile",
      showMore: "Show more hostesses",
      showMoreAria: "Show additional hostesses",
      noResults: "No hostesses match this filter right now.",
      placeholder: {
        title: "Premium Portrait Coming Soon",
        subtitle: "Official portrait available after management approval.",
      },
      stats: {
        age: "Age",
        height: "Height",
        weight: "Weight",
        measurements: "Measurements",
        ageUnit: "yrs",
      },
      modal: {
        closeAria: "Close profile",
        galleryLabel: "Gallery",
        galleryComingSoon: "Photos coming soon",
        descriptionLabel: "About",
        languagesLabel: "Languages Spoken",
        servicesLabel: "Services Offered",
        availabilityLabel: "Availability",
        locationLabel: "Neighborhood",
        bookAppointment: "Walk-In Only",
        bookAppointmentAria: "Book an appointment with {name}",
        lightboxOpenAria: "Enlarge photo {n}",
        lightboxPreviousAria: "Previous photo",
        lightboxNextAria: "Next photo",
      },
      location: "Downtown Montréal",
    },
    services: {
      eyebrow: "Our Menu of Experiences",
      title: "Services & Rates",
      subtitle: "Open 7 days a week",
      minutesLabel: "minutes",
      twoHandsLabel: "Two Hands",
      fourHandsLabel: "Four Hands",
      ctaBook: "Walk-In Only",
      bookAria: "Book the {duration}-minute experience",
      popularBadge: "Most Popular",
      cards: [
        {
          duration: "30",
          description:
            "A swift, focused immersion — full intensity, with no compromise on the artistry of touch.",
          priceTwo: "$40",
          priceFour: "$80",
        },
        {
          duration: "45",
          description:
            "The perfect balance of depth and ease, for a moment fully savored and unhurried.",
          priceTwo: "$50",
          priceFour: "$100",
        },
        {
          duration: "60",
          description:
            "The signature Elite One experience, in its fullest and most generous form.",
          priceTwo: "$80",
          priceFour: "$160",
        },
      ],
    },
    hiring: {
      eyebrow: "Join Our Team",
      title: "A refined place to work",
      paragraph:
        "Elite One Spa is looking for professional, reliable and respectful hostesses to join a close-knit team, in an elegant and caring environment.",
      paragraph2: "This position is reserved exclusively for candidates 18 years of age and older, no exceptions.",
      highlights: [
        {
          title: "Safe & Respectful Environment",
          description:
            "An attentive team and a setting designed with your safety and well-being in mind, at all times.",
        },
        {
          title: "Confidentiality & Discretion",
          description: "Your privacy is protected with the utmost care, at every step.",
        },
        {
          title: "Flexible Hours",
          description: "Availability that fits your life, with no rigid constraints.",
        },
        {
          title: "Training & Support",
          description: "Thorough onboarding from day one, and ongoing support after that.",
        },
        {
          title: "Personal Limits Respected",
          description: "Your boundaries and consent always come first, without exception.",
        },
        {
          title: "No Pressure, No Judgment",
          description: "You move at your own pace, in a climate of trust and mutual respect.",
        },
      ],
      note: "Applications are confidential and reviewed with discretion.",
      form: {
        title: "Apply Now",
        subtitle: "It only takes a few minutes.",
        fields: {
          fullName: { label: "Full Name", placeholder: "Your first and last name" },
          ageConfirm: { label: "I am 18 years old or older" },
          phone: { label: "Phone", placeholder: "(514) 000-0000" },
          email: { label: "Email", placeholder: "you@example.com" },
          availability: { label: "Availability", placeholder: "e.g. evenings, weekends" },
          experience: {
            label: "Previous Experience",
            placeholder: "Briefly tell us about your background",
            optionalTag: "Optional",
          },
          message: {
            label: "Message / Introduction",
            placeholder: "Introduce yourself in a few words",
          },
          consent: { label: "I agree to be contacted about my application" },
        },
        errors: {
          required: "This field is required.",
          ageRequired: "You must confirm you are 18 or older to apply.",
          consentRequired: "Please agree to be contacted to continue.",
          invalidEmail: "Please enter a valid email address.",
          invalidPhone: "Please enter a valid phone number.",
        },
        submit: "Submit Application",
        submitting: "Opening your email app…",
        successTitle: "Email App Opened",
        successMessage:
          "Your email app opened with your application already drafted. Just hit Send to submit it to us.",
        resetCta: "Submit another application",
      },
    },
    contact: {
      badge: "Contact 24/7",
      number: "514 543 8344",
      numberHref: "+15145438344",
      subtitle: "Private appointments • Discreet service • Downtown Montréal",
      callAria: "Call Elite One Spa at 514 543 8344",
      bookNow: "Walk-In Only",
      walkInLine1: "No appointments required.",
      walkInLine2: "Simply visit us in person.",
      bookAria: "Book a session at Elite One Spa",
    },
    contactSection: {
      eyebrow: "Get in touch",
      title: "Contact Elite One Spa",
      paragraph:
        "Every inquiry is handled with the utmost discretion. Whether you're booking a private session or simply have a question, our team responds promptly and in complete confidentiality.",
      form: {
        fields: {
          fullName: { label: "Full Name", placeholder: "Your first and last name" },
          phone: { label: "Phone", placeholder: "(514) 000-0000" },
          email: { label: "Email", placeholder: "you@example.com" },
          subject: { label: "Subject", placeholder: "e.g. Booking, general question" },
          message: { label: "Message", placeholder: "Write your message here…" },
        },
        errors: {
          required: "This field is required.",
          invalidEmail: "Please enter a valid email address.",
          invalidPhone: "Please enter a valid phone number.",
        },
        submit: "Send Message",
      },
      mapTitle: "Elite One Spa location on Google Maps",
      openInMaps: "Open in Google Maps",
      openInMapsAria: "Open Elite One Spa in Google Maps",
      addressAria: "Open Elite One Spa's address in Google Maps",
      hoursLabel: "Open 7 Days a Week",
      ageLabel: "18+ Only",
    },
    footer: {
      logoAria: "Elite One Spa — Home",
      tagline:
        "Elite One Spa offers a private and refined experience in the heart of Montréal. Every visit is designed around discretion, comfort and personalized attention, within an elegant setting reserved for adults. Our team is committed to creating a welcoming atmosphere where each guest can relax, disconnect and enjoy a moment entirely devoted to them.",
      contactTitle: "Get in Touch",
      address: "1621 St-Laurent Blvd, Montréal, QC",
      addressAria: "Open Elite One Spa's address in Google Maps",
      email: "info@eliteonespa.ca",
      emailAria: "Email Elite One Spa",
      hoursLabel: "Hours",
      hoursValue: "Open 7 Days a Week",
      linksTitle: "Quick Links",
      links: {
        treatments: "Treatments",
        availability: "Availability",
        hiring: "Hiring",
        contact: "Contact",
        privacy: "Privacy Policy",
        terms: "Terms",
      },
      trustTitle: "The Elite One Experience",
      trust: {
        rating: "4.9/5 Guest Experience",
        discreet: "Discreet Service",
        downtown: "Downtown Montréal",
        adultsOnly: "18+ Only",
        openDaily: "Open 7 Days",
      },
      bookAppointment: "Walk-In Only",
      bookAppointmentAria: "Book an appointment at Elite One Spa",
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

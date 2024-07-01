import type { GoogleFont } from "@remotion/google-fonts";
 
export const top25 = [
  {
    family: "Inter",
    load: () => import("@remotion/google-fonts/Inter") as Promise<GoogleFont>,
  },
  {
    family: "Kanit",
    load: () => import("@remotion/google-fonts/Kanit") as Promise<GoogleFont>,
  },
  {
    family: "Lato",
    load: () => import("@remotion/google-fonts/Lato") as Promise<GoogleFont>,
  },
  {
    family: "Lora",
    load: () => import("@remotion/google-fonts/Lora") as Promise<GoogleFont>,
  },
  {
    family: "Merriweather",
    load: () =>
      import("@remotion/google-fonts/Merriweather") as Promise<GoogleFont>,
  },
  {
    family: "Montserrat",
    load: () =>
      import("@remotion/google-fonts/Montserrat") as Promise<GoogleFont>,
  },
  {
    family: "Noto Sans",
    load: () =>
      import("@remotion/google-fonts/NotoSans") as Promise<GoogleFont>,
  },
  {
    family: "Noto Sans JP",
    load: () =>
      import("@remotion/google-fonts/NotoSansJP") as Promise<GoogleFont>,
  },
  {
    family: "Noto Sans KR",
    load: () =>
      import("@remotion/google-fonts/NotoSansKR") as Promise<GoogleFont>,
  },
  {
    family: "Noto Sans TC",
    load: () =>
      import("@remotion/google-fonts/NotoSansTC") as Promise<GoogleFont>,
  },
  {
    family: "Nunito",
    load: () => import("@remotion/google-fonts/Nunito") as Promise<GoogleFont>,
  },
  {
    family: "Nunito Sans",
    load: () =>
      import("@remotion/google-fonts/NunitoSans") as Promise<GoogleFont>,
  },
  {
    family: "Open Sans",
    load: () =>
      import("@remotion/google-fonts/OpenSans") as Promise<GoogleFont>,
  },
  {
    family: "Oswald",
    load: () => import("@remotion/google-fonts/Oswald") as Promise<GoogleFont>,
  },
  {
    family: "PT Sans",
    load: () => import("@remotion/google-fonts/PTSans") as Promise<GoogleFont>,
  },
  {
    family: "Playfair Display",
    load: () =>
      import("@remotion/google-fonts/PlayfairDisplay") as Promise<GoogleFont>,
  },
  {
    family: "Poppins",
    load: () => import("@remotion/google-fonts/Poppins") as Promise<GoogleFont>,
  },
  {
    family: "Raleway",
    load: () => import("@remotion/google-fonts/Raleway") as Promise<GoogleFont>,
  },
  {
    family: "Roboto",
    load: () => import("@remotion/google-fonts/Roboto") as Promise<GoogleFont>,
  },
  {
    family: "Roboto Condensed",
    load: () =>
      import("@remotion/google-fonts/RobotoCondensed") as Promise<GoogleFont>,
  },
  {
    family: "Roboto Mono",
    load: () =>
      import("@remotion/google-fonts/RobotoMono") as Promise<GoogleFont>,
  },
  {
    family: "Roboto Slab",
    load: () =>
      import("@remotion/google-fonts/RobotoSlab") as Promise<GoogleFont>,
  },
  {
    family: "Rubik",
    load: () => import("@remotion/google-fonts/Rubik") as Promise<GoogleFont>,
  },
  {
    family: "Ubuntu",
    load: () => import("@remotion/google-fonts/Ubuntu") as Promise<GoogleFont>,
  },
  {
    family: "Work Sans",
    load: () =>
      import("@remotion/google-fonts/WorkSans") as Promise<GoogleFont>,
  },
];



export const importFont = async (fontName: string) => {
  const importName = fontName;

  switch (importName) {
    case 'Inter':
      return await import("@remotion/google-fonts/Inter");
    case 'Kanit':
      return await import("@remotion/google-fonts/Kanit");
    case 'Lato':
      return await import("@remotion/google-fonts/Lato");
    case 'Lora':
      return await import("@remotion/google-fonts/Lora");
    case 'Merriweather':
      return await import("@remotion/google-fonts/Merriweather");
    case 'Montserrat':
      return await import("@remotion/google-fonts/Montserrat");
    case 'Noto Sans':
      return await import("@remotion/google-fonts/NotoSans");
    case 'Noto Sans JP':
      return await import("@remotion/google-fonts/NotoSansJP");
    case 'Noto Sans KR':
      return await import("@remotion/google-fonts/NotoSansKR");
    case 'Noto Sans TC':
      return await import("@remotion/google-fonts/NotoSansTC");
    case 'Nunito':
      return await import("@remotion/google-fonts/Nunito");
    case 'Nunito Sans':
      return await import("@remotion/google-fonts/NunitoSans");
    case 'Open Sans':
      return await import("@remotion/google-fonts/OpenSans");
    case 'Oswald':
      return await import("@remotion/google-fonts/Oswald");
    case 'PT Sans':
      return await import("@remotion/google-fonts/PTSans");
    case 'Playfair Display':
      return await import("@remotion/google-fonts/PlayfairDisplay");
    case 'Poppins':
      return await import("@remotion/google-fonts/Poppins");
    case 'Raleway':
      return await import("@remotion/google-fonts/Raleway");
    case 'Roboto':
      return await import("@remotion/google-fonts/Roboto");
    case 'Roboto Condensed':
      return await import("@remotion/google-fonts/RobotoCondensed");
    case 'Roboto Mono':
      return await import("@remotion/google-fonts/RobotoMono");
    case 'Roboto Slab':
      return await import("@remotion/google-fonts/RobotoSlab");
    case 'Rubik':
      return await import("@remotion/google-fonts/Rubik");
    case 'Ubuntu':
      return await import("@remotion/google-fonts/Ubuntu");
    case 'Work Sans':
      return await import("@remotion/google-fonts/WorkSans");
    case undefined:
      return await import("@remotion/google-fonts/Rubik");
    default:
      return await import("@remotion/google-fonts/Rubik");
  }
};

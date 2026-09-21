import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  AudioLines,
  Bug,
  CircleHelp,
  Gauge,
  Info,
  Leaf,
  Pause,
  Play,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

type PestPreset = {
  id: string;
  label: string;
  note: string;
  summary: string;
  habitat: string;
  protection: string;
  wikipediaUrl: string;
  category: 'Flying insects' | 'Crawling insects' | 'Garden pests' | 'Wildlife';
  referenceHz: number;
  frequency: number;
  intensity: number;
};

const icons8PestIcons: Record<string, string> = {
  mosquito: 'https://img.icons8.com/ios-filled/144/mosquito.png',
  moths: 'https://img.icons8.com/?size=144&id=Q746TVhfGCZY&format=png',
  houseflies: 'https://img.icons8.com/ios-filled/144/fly.png',
  'fruit-flies': 'https://img.icons8.com/?size=144&id=9240&format=png',
  wasps: 'https://img.icons8.com/ios-filled/144/wasp.png',
  honeybees: 'https://img.icons8.com/ios-filled/144/bee.png',
  gnats: 'https://img.icons8.com/?size=144&id=25363&format=png',
  cockroaches: 'https://img.icons8.com/ios-filled/144/cockroach.png',
  ants: 'https://img.icons8.com/ios-filled/144/ant.png',
  fleas: 'https://img.icons8.com/ios-filled/144/flea.png',
  'bed-bugs': 'https://img.icons8.com/?size=144&id=7rr9Vx1ckUvH&format=png',
  crickets: 'https://static.thenounproject.com/png/cricket-insect-icon-1976090-512.png',
  silverfish: 'https://img.icons8.com/?size=144&id=HFUkUwmuIXiv&format=png',
  spiders: 'https://img.icons8.com/ios-filled/144/spider.png',
  'japanese-beetles': 'https://img.icons8.com/?size=144&id=dUffInH7HEmp&format=png',
  aphids: 'https://img.icons8.com/?size=144&id=YvJL2PcTqZxn&format=png',
  earwigs: 'https://img.icons8.com/ios-filled/144/grasshopper.png',
  'stink-bugs': 'https://img.icons8.com/?size=144&id=3uG4ah69jFsX&format=png',
  rodents: 'https://img.icons8.com/?size=144&id=Nwhptd8VKVaR&format=png',
  bats: 'https://img.icons8.com/ios-filled/144/bat.png',
  raccoons: 'https://img.icons8.com/?size=144&id=xuqvSAsgBfzm&format=png',
  deer: 'https://img.icons8.com/ios-filled/144/deer.png',
};

const positionForFrequency = (hz: number) =>
  Math.round((Math.log(hz / 20) / Math.log(1100)) * 100);

const presets: PestPreset[] = [
  { id: 'mosquito', label: 'Mosquitoes', note: 'Reported sensitivity band', summary: 'Small flying insects whose females may spread diseases while feeding on blood.', habitat: 'Warm, damp places with standing water; activity often rises from spring through autumn.', protection: 'Remove standing water, use screens, wear long sleeves, and follow local repellent guidance.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Mosquito', category: 'Flying insects', referenceHz: 6240, frequency: positionForFrequency(6240), intensity: 46 },
  { id: 'moths', label: 'Moths', note: 'Reported sensitivity band', summary: 'Mostly nocturnal relatives of butterflies; some larvae damage clothing, stored food, or crops.', habitat: 'Dark closets, pantries, leaf litter, and vegetation; indoor problems can persist year-round.', protection: 'Store fabrics and dry goods clean and sealed, and inspect pantry items for larvae or webbing.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Moth', category: 'Flying insects', referenceHz: 3320, frequency: positionForFrequency(3320), intensity: 38 },
  { id: 'houseflies', label: 'Houseflies', note: 'Experimental reference', summary: 'Common scavenging flies that can mechanically transfer microbes from waste and decaying material.', habitat: 'Garbage, manure, compost, and warm indoor areas; numbers usually increase in warm weather.', protection: 'Seal food and rubbish, clean spills promptly, use screens, and keep bins closed.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Housefly', category: 'Flying insects', referenceHz: 18000, frequency: positionForFrequency(18000), intensity: 44 },
  { id: 'fruit-flies', label: 'Fruit flies', note: 'Experimental reference', summary: 'Tiny flies attracted to fermenting fruit, drinks, and organic residue rather than intact fresh food.', habitat: 'Kitchens, drains, recycling containers, and overripe produce; infestations can appear any season indoors.', protection: 'Refrigerate or cover produce, rinse bottles, empty organic waste, and clean drain residue.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Drosophila_melanogaster', category: 'Flying insects', referenceHz: 12000, frequency: positionForFrequency(12000), intensity: 40 },
  { id: 'wasps', label: 'Wasps', note: 'Experimental reference', summary: 'Predatory or nectar-feeding insects; some species defend nests aggressively and can sting repeatedly.', habitat: 'Eaves, wall cavities, sheds, soil, and shrubs; nests are most active in late summer and early autumn.', protection: 'Keep food covered, avoid swatting near nests, and use a qualified pest professional for active nests.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Wasp', category: 'Flying insects', referenceHz: 18000, frequency: positionForFrequency(18000), intensity: 48 },
  { id: 'honeybees', label: 'Honeybees', note: 'Near the upper device range', summary: 'Social pollinators that live in colonies and are important to many flowering plants and crops.', habitat: 'Hives, tree cavities, and sheltered structures; foraging increases during flowering seasons.', protection: 'Do not block a hive or use pesticides casually; contact a local beekeeper or wildlife service.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Western_honey_bee', category: 'Flying insects', referenceHz: 21000, frequency: positionForFrequency(21000), intensity: 34 },
  { id: 'gnats', label: 'Gnats', note: 'Experimental reference', summary: 'A loose common name for several tiny flying insects, including fungus gnats and biting midges.', habitat: 'Moist soil, decaying plants, stagnant water, and shaded vegetation; indoor numbers follow moisture.', protection: 'Reduce overwatering, improve drainage, remove decaying matter, and repair damp areas.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Gnat', category: 'Flying insects', referenceHz: 15000, frequency: positionForFrequency(15000), intensity: 42 },
  { id: 'cockroaches', label: 'Cockroaches', note: 'Experimental reference', summary: 'Nocturnal scavengers that can contaminate food and trigger allergies through droppings and shed material.', habitat: 'Warm, dark, humid gaps near plumbing, appliances, food, and wall voids; indoors they can persist year-round.', protection: 'Remove food and water sources, seal cracks, fix leaks, and use targeted bait or professional treatment.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Cockroach', category: 'Crawling insects', referenceHz: 3000, frequency: positionForFrequency(3000), intensity: 56 },
  { id: 'ants', label: 'Ants', note: 'Experimental reference', summary: 'Social insects that forage along scent trails and may enter buildings for food, water, or shelter.', habitat: 'Soil, wall voids, wood, and plant bases; indoor activity often increases during wet or hot weather.', protection: 'Wipe trails, store food sealed, trim vegetation from buildings, and seal entry points.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Ant', category: 'Crawling insects', referenceHz: 5000, frequency: positionForFrequency(5000), intensity: 50 },
  { id: 'fleas', label: 'Fleas', note: 'Experimental reference', summary: 'Wingless jumping parasites whose adults feed on blood and whose immature stages hide in the environment.', habitat: 'Pet bedding, carpets, floor cracks, and shaded outdoor areas; warm humid seasons favor development.', protection: 'Treat pets through a veterinarian, wash bedding hot, vacuum often, and address the full life cycle.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Flea', category: 'Crawling insects', referenceHz: 8000, frequency: positionForFrequency(8000), intensity: 52 },
  { id: 'bed-bugs', label: 'Bed bugs', note: 'No proven band', summary: 'Small nocturnal insects that feed on blood and can spread through luggage, furniture, and clothing.', habitat: 'Mattress seams, bed frames, upholstery, and cracks near sleeping areas; indoor infestations have no season.', protection: 'Inspect seams, use encasements, avoid moving infested furniture, and use licensed heat or chemical treatment.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Bed_bug', category: 'Crawling insects', referenceHz: 5000, frequency: positionForFrequency(5000), intensity: 48 },
  { id: 'crickets', label: 'Crickets', note: 'Reported hearing range', summary: 'Leaping insects known for sound-producing calls, usually made by males rubbing their wings together.', habitat: 'Grass, leaf litter, basements, and garages; outdoor calling peaks in warm months and evenings.', protection: 'Reduce outdoor lighting near doors, seal gaps, remove damp debris, and keep vegetation trimmed.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Cricket_(insect)', category: 'Crawling insects', referenceHz: 4000, frequency: positionForFrequency(4000), intensity: 44 },
  { id: 'silverfish', label: 'Silverfish', note: 'Experimental reference', summary: 'Wingless nocturnal insects that feed on starches, paper, glue, and some fabrics.', habitat: 'Cool, dark, humid cracks, bathrooms, basements, and storage areas; indoor activity can occur year-round.', protection: 'Lower humidity, improve ventilation, repair leaks, and store paper and textiles in dry sealed containers.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Silverfish', category: 'Crawling insects', referenceHz: 10000, frequency: positionForFrequency(10000), intensity: 46 },
  { id: 'spiders', label: 'Spiders', note: 'Vibration, not airborne sound', summary: 'Predatory arachnids that usually help control other insects; most species are harmless to people.', habitat: 'Corners, sheds, gardens, woodpiles, and undisturbed gaps; sightings vary with prey and weather.', protection: 'Reduce clutter and outdoor lighting, seal gaps, and relocate rather than crush beneficial species when practical.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Spider', category: 'Crawling insects', referenceHz: 20000, frequency: positionForFrequency(20000), intensity: 30 },
  { id: 'japanese-beetles', label: 'Japanese beetles', note: 'Experimental reference', summary: 'Leaf-feeding beetles whose adults can skeletonize many ornamental and crop plants.', habitat: 'Sunny vegetation and lawns; adults are most visible during the summer flight season.', protection: 'Hand-pick small numbers, protect valuable plants with mesh, and avoid relying on traps placed beside plants.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Japanese_beetle', category: 'Garden pests', referenceHz: 16000, frequency: positionForFrequency(16000), intensity: 44 },
  { id: 'aphids', label: 'Aphids', note: 'Experimental reference', summary: 'Sap-feeding insects that can distort new growth and spread plant viruses while feeding.', habitat: 'Tender shoots and leaf undersides; populations often build quickly in spring and on stressed plants.', protection: 'Rinse plants, encourage ladybirds and other predators, prune heavily affected growth, and avoid excess nitrogen.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Aphid', category: 'Garden pests', referenceHz: 12000, frequency: positionForFrequency(12000), intensity: 40 },
  { id: 'earwigs', label: 'Earwigs', note: 'Experimental reference', summary: 'Mostly nocturnal scavengers and plant feeders recognized by the pincers at the rear of the body.', habitat: 'Moist mulch, leaf litter, stones, and cracks; they are more visible after damp weather.', protection: 'Reduce damp hiding places, improve drainage, and use rolled newspaper traps around seedlings.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Earwig', category: 'Garden pests', referenceHz: 7000, frequency: positionForFrequency(7000), intensity: 48 },
  { id: 'stink-bugs', label: 'Stink bugs', note: 'Experimental reference', summary: 'Shield-shaped plant feeders that release a strong odor when disturbed or crushed.', habitat: 'Gardens and orchards in warm seasons; adults may seek sheltered walls and buildings in autumn.', protection: 'Screen openings, seal cracks, vacuum indoor visitors, and avoid crushing them on surfaces.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Shield_bug', category: 'Garden pests', referenceHz: 14000, frequency: positionForFrequency(14000), intensity: 42 },
  { id: 'rodents', label: 'Small rodents', note: 'Ultrasonic sensitivity', summary: 'A broad group including mice and rats; they can damage structures and contaminate food with urine and droppings.', habitat: 'Wall voids, attics, garages, sheds, and areas close to food and shelter; buildings can host them in any season.', protection: 'Seal openings larger than a pencil, store food securely, remove clutter, and use snap traps safely and lawfully.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Rodent', category: 'Wildlife', referenceHz: 11700, frequency: positionForFrequency(11700), intensity: 54 },
  { id: 'bats', label: 'Bats', note: 'Wide ultrasonic range', summary: 'Nocturnal flying mammals that consume many insects and use echolocation to navigate and hunt.', habitat: 'Caves, tree cavities, attics, and roof spaces; seasonal movement depends on species and climate.', protection: 'Never handle bats bare-handed, preserve roosts where possible, and use humane exclusion only outside maternity periods.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Bat', category: 'Wildlife', referenceHz: 20000, frequency: positionForFrequency(20000), intensity: 28 },
  { id: 'raccoons', label: 'Raccoons', note: 'Experimental reference', summary: 'Adaptable nocturnal mammals that can raid rubbish, damage roofs, and carry parasites or pathogens.', habitat: 'Tree hollows, chimneys, attics, and urban food sources; activity occurs year-round.', protection: 'Secure bins, remove accessible food, close entry points only after confirming no animals are inside, and follow wildlife rules.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Raccoon', category: 'Wildlife', referenceHz: 18000, frequency: positionForFrequency(18000), intensity: 40 },
  { id: 'deer', label: 'Deer', note: 'Upper hearing range', summary: 'Herbivorous mammals that browse plants and can damage gardens, crops, and young trees.', habitat: 'Woodland edges, fields, and suburban plantings; browsing pressure is often highest in spring and winter.', protection: 'Use tall fencing, protect young trees, and choose deer-resistant plants suited to the local area.', wikipediaUrl: 'https://en.wikipedia.org/wiki/Deer', category: 'Wildlife', referenceHz: 21000, frequency: positionForFrequency(21000), intensity: 36 },
];

function PestSpecimen({ id, category }: { id?: string; category?: PestPreset['category'] }) {
  const isMosquito = id === 'mosquito' || id === 'gnats';
  const isMoth = id === 'moths';
  const isFly = id === 'houseflies' || id === 'fruit-flies';
  const isBee = id === 'wasps' || id === 'honeybees';
  const isAnt = id === 'ants';
  const isSpider = id === 'spiders';
  const isCricket = id === 'crickets';
  const isRoach = id === 'cockroaches' || id === 'silverfish';
  const isBat = id === 'bats';
  const isDeer = id === 'deer';
  const isWildlife = category === 'Wildlife';
  const isGarden = category === 'Garden pests';

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 180 130"
      className="h-24 w-36 text-primary drop-shadow-[0_0_18px_hsl(var(--primary)/.28)] sm:h-28 sm:w-40"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    >
      {isMosquito ? (
        <>
          <path d="M90 28v68M90 28 83 11M90 28l7-17M88 43 59 27M92 43l29-16M88 59 51 54M92 59l37-5M88 75 61 91M92 75l27 16" />
          <path d="M84 30c-20-14-34-12-42 0 17 1 29 9 38 19M96 30c20-14 34-12 42 0-17 1-29 9-38 19" fill="currentColor" opacity=".1" />
          <path d="M90 28 82 7" />
          <circle cx="86" cy="37" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="94" cy="37" r="2.5" fill="currentColor" stroke="none" />
        </>
      ) : isMoth ? (
        <>
          <path d="M90 31c-7 7-10 18-10 31s3 26 10 35c7-9 10-21 10-35s-3-24-10-31Z" fill="currentColor" opacity=".17" />
          <path d="M83 39C60 19 39 23 27 43c21-1 38 7 54 25M97 39c23-20 44-16 56 4-21-1-38 7-54 25M81 62c-18 4-33 15-39 31 17-2 32-9 48-23M99 62c18 4 33 15 39 31-17-2-32-9-48-23M90 31V15M84 20l-9-9M96 20l9-9" />
          <circle cx="86" cy="42" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="94" cy="42" r="2.5" fill="currentColor" stroke="none" />
        </>
      ) : isFly ? (
        <>
          <ellipse cx="90" cy="66" rx="14" ry="28" fill="currentColor" opacity=".14" />
          <path d="M79 51C59 25 35 28 26 48c19-3 36 2 52 17M101 51c20-26 44-23 53-3-19-3-36 2-52 17M90 38v56M77 56 53 44M103 56l24-12M76 71 52 72M104 71l24 1M80 84l-18 15M100 84l18 15" />
          <circle cx="85" cy="43" r="7" fill="currentColor" opacity=".2" />
          <circle cx="95" cy="43" r="7" fill="currentColor" opacity=".2" />
        </>
      ) : isBee ? (
        <>
          <path d="M90 29c-13 0-21 16-21 35s8 31 21 31 21-12 21-31-8-35-21-35Z" fill="currentColor" opacity=".14" />
          <path d="M76 48h28M71 63h38M75 78h30M90 29v66M69 47C51 25 33 28 26 43c18 0 32 7 44 21M111 47c18-22 36-19 43-4-18 0-32 7-44 21M81 30l-8-17M99 30l8-17M90 95l-9 15M90 95l9 15M111 75l13 4" />
        </>
      ) : isAnt ? (
        <>
          <circle cx="68" cy="66" r="15" fill="currentColor" opacity=".12" />
          <circle cx="91" cy="63" r="18" fill="currentColor" opacity=".16" />
          <circle cx="115" cy="68" r="13" fill="currentColor" opacity=".12" />
          <path d="M79 53 61 35M102 50l17-19M62 58 40 50M64 75 42 84M84 80 70 101M101 80l16 21M116 78l22 9M118 59l22-8M89 45V29M75 45 60 28M105 45l15-17" />
          <circle cx="112" cy="64" r="2.5" fill="currentColor" stroke="none" />
        </>
      ) : isSpider ? (
        <>
          <ellipse cx="90" cy="66" rx="19" ry="26" fill="currentColor" opacity=".15" />
          <circle cx="90" cy="37" r="14" fill="currentColor" opacity=".12" />
          <path d="M75 42 48 25M75 51 40 45M74 63 38 66M76 75 49 91M105 42l27-17M105 51l35-6M106 63l36 3M104 75l27 16" />
          <circle cx="85" cy="34" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="95" cy="34" r="2.5" fill="currentColor" stroke="none" />
        </>
      ) : isCricket ? (
        <>
          <path d="M91 34c-12 7-18 20-16 36 2 16 11 27 22 27 10 0 18-12 17-27-1-16-9-29-23-36Z" fill="currentColor" opacity=".14" />
          <path d="M86 35 72 16M96 35l15-19M76 55 51 38M104 55l25-17M76 70 45 73M104 70l31 3M82 82 52 104M98 82l30 22M88 31l-3-16M94 31l3-16" />
          <circle cx="87" cy="42" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="97" cy="42" r="2.5" fill="currentColor" stroke="none" />
        </>
      ) : isRoach ? (
        <>
          <path d="M90 27c-17 0-28 17-28 39s11 35 28 35 28-13 28-35-11-39-28-39Z" fill="currentColor" opacity=".15" />
          <path d="M90 27v74M77 34 56 16M103 34l21-18M67 54 39 38M113 54l28-16M65 72 35 77M115 72l30 5M70 88 48 106M110 88l22 18M80 39c7 7 13 7 20 0M76 58c10 7 18 7 28 0M76 78c10 7 18 7 28 0" />
        </>
      ) : isBat ? (
        <>
          <path d="M90 50 68 28 31 18l13 31-24 12 36 5c8 13 18 20 34 20s26-7 34-20l36-5-24-12 13-31-37 10Z" fill="currentColor" opacity=".13" />
          <path d="M90 50 68 28 31 18l13 31-24 12 36 5c8 13 18 20 34 20s26-7 34-20l36-5-24-12 13-31-37 10M90 50v36M80 51l-9-11M100 51l9-11" />
          <circle cx="84" cy="47" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="96" cy="47" r="2.5" fill="currentColor" stroke="none" />
        </>
      ) : isDeer ? (
        <>
          <path d="M67 93c-8-16-5-33 8-47 8-8 19-11 30-4 11 7 15 20 11 35-4 15-14 24-29 24-9 0-15-3-20-8Z" fill="currentColor" opacity=".12" />
          <path d="M70 53 56 36 62 18M61 27 46 16M59 34 40 32M107 50l20-19 4-17M126 30l16-13M128 38l19-3M80 50 61 43M100 50l19-7M77 90l-8 17M102 90l8 17M83 73c5 3 9 3 14 0" />
          <circle cx="78" cy="57" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="100" cy="57" r="2.5" fill="currentColor" stroke="none" />
        </>
      ) : isWildlife ? (
        <>
          <path d="M51 78c-10 4-19 3-28-3-5-3-11-1-14 3 6 11 18 17 31 15 11-1 19-6 26-12" opacity=".75" />
          <path d="M66 48c1-14 7-22 17-22 11 0 18 12 18 30 0 24-14 43-34 43-14 0-25-9-25-21 0-13 11-23 24-30Z" fill="currentColor" opacity=".12" />
          <path d="M76 30 69 15l14 7 12-9-2 19M102 40c13-9 25-10 35-4" />
          <circle cx="89" cy="43" r="2.5" fill="currentColor" stroke="none" />
          <path d="M111 86c14 5 24 2 31-7" />
        </>
      ) : isGarden ? (
        <>
          <path d="M87 26c-10 9-18 19-18 34 0 20 12 36 22 36s22-16 22-36c0-15-8-25-18-34" fill="currentColor" opacity=".13" />
          <path d="M91 27v69M69 59c-13-11-25-13-37-7M111 59c13-11 25-13 37-7M73 78c-11 6-20 14-24 25M107 78c11 6 20 14 24 25" />
          <path d="M84 26 76 12M98 26l8-14M69 46 49 32M111 46l20-14" />
          <circle cx="85" cy="48" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="97" cy="48" r="2.5" fill="currentColor" stroke="none" />
        </>
      ) : (
        <>
          <path d="M90 26c-13 0-23 14-23 34s10 36 23 36 23-16 23-36-10-34-23-34Z" fill="currentColor" opacity=".13" />
          <path d="M90 26v70M68 48 47 31M112 48l21-17M67 63 39 57M113 63l28-6M70 80 49 98M110 80l21 18M78 28 69 13M102 28l9-15" />
          <path d="M76 42c-14-17-29-17-38-4 16 2 27 9 32 19M104 42c14-17 29-17 38-4-16 2-27 9-32 19" fill="currentColor" opacity=".08" />
          <circle cx="83" cy="45" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="97" cy="45" r="2.5" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  );
}

function Icons8PestIcon({ id, active = false, compact = false }: { id?: string; active?: boolean; compact?: boolean }) {
  const iconUrl = id ? icons8PestIcons[id] : undefined;
  return (
    <div className={compact ? 'flex h-8 w-8 items-center justify-center' : 'flex h-24 w-36 items-center justify-center sm:h-28 sm:w-40'}>
      <img
        src={iconUrl}
        alt=""
        className={compact
          ? `h-7 w-7 object-contain ${active ? 'icons8-pest-active' : 'icons8-pest-inactive'}`
          : `h-24 w-24 object-contain sm:h-28 sm:w-28 ${active ? 'icons8-pest-active' : 'icons8-pest-inactive'}`}
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />
      <span className="sr-only">{id ?? 'pest'} icon from Icons8</span>
    </div>
  );
}

function Home() {
  const [frequencyPosition, setFrequencyPosition] = useState(positionForFrequency(6240));
  const [intensity, setIntensity] = useState(42);
  const [preset, setPreset] = useState('mosquito');
  const [pestSearch, setPestSearch] = useState('');
  const [pestCategory, setPestCategory] = useState('All');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Ready to experiment');
  const [audioSupported, setAudioSupported] = useState(true);
  const audioRef = useRef<{
    context: AudioContext;
    oscillator: OscillatorNode;
    gain: GainNode;
  } | null>(null);

  const frequency = useMemo(
    () => 20 * Math.pow(1100, frequencyPosition / 100),
    [frequencyPosition],
  );

  const formatFrequency = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 1 : 2)} kHz`;
    return `${Math.round(value)} Hz`;
  };

  const stopAudio = () => {
    const active = audioRef.current;
    if (!active) return;
    active.gain.gain.cancelScheduledValues(active.context.currentTime);
    active.gain.gain.setTargetAtTime(0, active.context.currentTime, 0.04);
    window.setTimeout(() => {
      try {
        active.oscillator.stop();
        active.context.close();
      } catch {
        // The oscillator may already be stopped by the browser.
      }
    }, 120);
    audioRef.current = null;
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  useEffect(() => {
    const AudioContextClass = window.AudioContext ?? (window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;
    setAudioSupported(Boolean(AudioContextClass));
  }, []);

  useEffect(() => {
    const active = audioRef.current;
    if (!active) return;
    active.oscillator.frequency.setTargetAtTime(frequency, active.context.currentTime, 0.025);
    active.gain.gain.setTargetAtTime((intensity / 100) * 0.055, active.context.currentTime, 0.04);
  }, [frequency, intensity]);

  const startAudio = async () => {
    const AudioContextClass = window.AudioContext ?? (window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;
    if (!AudioContextClass) {
      setAudioSupported(false);
      setStatus('This browser cannot create a sound signal');
      return;
    }
    try {
      const context = new AudioContextClass();
      await context.resume();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.value = (intensity / 100) * 0.055;
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      audioRef.current = { context, oscillator, gain };
      setIsRunning(true);
      setStatus('Signal is running in this browser');
    } catch {
      setStatus('The browser did not allow audio to start');
      setIsRunning(false);
    }
  };

  const toggleSignal = () => {
    if (isRunning) {
      stopAudio();
      setIsRunning(false);
      setStatus('Signal stopped');
    } else {
      void startAudio();
    }
  };

  const choosePreset = (nextPreset: PestPreset) => {
    if (isRunning) {
      stopAudio();
      setIsRunning(false);
    }
    setPreset(nextPreset.id);
    setFrequencyPosition(nextPreset.frequency);
    setIntensity(nextPreset.intensity);
    setStatus(`${nextPreset.label} preset loaded`);
  };

  const activeBand = frequency >= 20000 ? 'Ultrasonic' : 'Audible edge';
  const selectedPreset = presets.find((item) => item.id === preset);
  const categories = ['All', ...Array.from(new Set(presets.map((item) => item.category)))];
  const visiblePresets = useMemo(() => {
    const normalizedSearch = pestSearch.trim().toLowerCase();
    return presets.filter((item) => {
      const matchesCategory = pestCategory === 'All' || item.category === pestCategory;
      const matchesSearch = !normalizedSearch
        || item.label.toLowerCase().includes(normalizedSearch)
        || item.category.toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [pestCategory, pestSearch]);

  const bars = Array.from({ length: 34 }, (_, index) => {
    const centerBias = 1 - Math.abs(index - 16.5) / 18;
    return Math.max(0.22, centerBias * (0.62 + intensity / 190));
  });

  return (
    <main className="noise min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <div className="instrument-grid min-h-[100dvh]">
        <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
              <Radio size={19} strokeWidth={2.4} />
            </div>
            <div>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-primary">Field instrument / 01</p>
              <p className="font-display font-semibold tracking-tight text-foreground">Nightwatch</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-2 text-xs text-muted-foreground sm:flex">
            <span className={`h-2 w-2 rounded-full ${isRunning ? 'bg-primary shadow-[0_0_12px_hsl(var(--primary)/.65)]' : 'bg-muted-foreground/50'}`} />
            {isRunning ? 'Signal active' : 'Standby'}
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-[1440px] gap-5 px-5 pb-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_370px] lg:gap-6 lg:px-12">
          <section className="rise-in relative overflow-hidden rounded-[1.6rem] border border-border bg-card/85 p-5 shadow-[var(--shadow-md)] backdrop-blur sm:p-8 lg:min-h-[710px] lg:p-12">
            <div className="pointer-events-none absolute -right-36 -top-36 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative flex h-full flex-col">
              <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-start">
                <div className="max-w-xl">
                  <div className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    <Sparkles size={14} className="text-accent" />
                    Browser signal controller
                  </div>
                  <h1 className="max-w-[680px] font-display text-[clamp(2.5rem,6vw,5.8rem)] font-semibold leading-[.94] tracking-[-.06em] text-foreground">
                    {selectedPreset?.label ?? 'Choose a subject'}
                    <span className="block text-primary">field notes.</span>
                  </h1>
                  <p className="mt-6 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
                    {selectedPreset?.summary ?? 'Choose a pest from the library to learn where it lives, when it appears, and how to respond.'}
                  </p>
                </div>
                <div className="hidden shrink-0 sm:block">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/5">
                    <Leaf size={25} className="text-primary" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col items-center justify-center py-10 text-center lg:py-6">
                <div className={`specimen-stage ${isRunning ? 'is-active' : ''}`}>
                  <div className="specimen-ring specimen-ring-one" />
                  <div className="specimen-ring specimen-ring-two" />
                  <Icons8PestIcon id={selectedPreset?.id} active={isRunning} />
                </div>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[.24em] text-muted-foreground">
                  {selectedPreset?.label ?? 'Custom sweep'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground/80">
                  {selectedPreset ? `${selectedPreset.category} · reference loaded` : 'Manual frequency · live control'}
                </p>
                {selectedPreset && (
                  <div className="mt-6 grid w-full max-w-2xl gap-3 text-left sm:grid-cols-2">
                    <div className="rounded-xl border border-border bg-background/35 p-3.5">
                      <p className="font-mono text-[9px] uppercase tracking-[.18em] text-primary">Where to find it</p>
                      <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{selectedPreset.habitat}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/35 p-3.5">
                      <p className="font-mono text-[9px] uppercase tracking-[.18em] text-accent">Protection note</p>
                      <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{selectedPreset.protection}</p>
                    </div>
                  </div>
                )}
                {selectedPreset && (
                  <a
                    href={selectedPreset.wikipediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 text-[11px] text-muted-foreground underline underline-offset-2 hover:text-primary"
                  >
                    Read the Wikipedia overview
                  </a>
                )}
              </div>

              <div className="mt-auto pt-12 lg:pt-20">
                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Frequency / {activeBand}</p>
                    <p data-testid="text-frequency-value" className="font-mono text-4xl font-medium tracking-[-.06em] text-foreground sm:text-6xl">
                      {formatFrequency(frequency)}
                    </p>
                  </div>
                  <div className="mb-1 text-right">
                    <p className="font-mono text-xs text-muted-foreground">{Math.round(frequency)} cycles / sec</p>
                    <p className="mt-1 text-xs text-accent">Live control</p>
                  </div>
                </div>

                <div className="relative mt-5 rounded-2xl border border-border bg-background/50 px-4 py-8 sm:px-7">
                  <div className="absolute left-7 right-7 top-1/2 h-1 -translate-y-1/2 rounded-full bg-secondary sm:left-10 sm:right-10">
                    <div className="h-full rounded-full bg-primary transition-[width] duration-150" style={{ width: `${frequencyPosition}%` }} />
                  </div>
                  <div className="pointer-events-none absolute left-7 right-7 top-[calc(50%_-_28px)] flex justify-between font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground/70 sm:left-10 sm:right-10">
                    <span>Audible</span><span>Ultrasonic</span>
                  </div>
                  <input
                    aria-label="Frequency lever"
                    data-testid="input-frequency"
                    type="range"
                    min="0"
                    max="100"
                    value={frequencyPosition}
                    onChange={(event) => {
                      setFrequencyPosition(Number(event.target.value));
                      setPreset('custom');
                      setStatus('Custom frequency selected');
                    }}
                    className="relative z-10 h-12 w-full cursor-grab appearance-none bg-transparent accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:h-1 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-thumb]:mt-[-14px] [&::-webkit-slider-thumb]:h-10 [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-xl [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-primary-foreground [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_5px_14px_hsl(224_38%_4%/.35)] [&::-moz-range-thumb]:h-9 [&::-moz-range-thumb]:w-9 [&::-moz-range-thumb]:rounded-xl [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-primary-foreground [&::-moz-range-thumb]:bg-primary"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>20 Hz</span>
                  <span className="hidden sm:inline">Drag or use arrow keys to tune</span>
                  <span>22.0 kHz</span>
                </div>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-5">
            <section className="rise-in rounded-[1.6rem] border border-border bg-card p-5 shadow-[var(--shadow-sm)] [animation-delay:80ms] sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.22em] text-muted-foreground">Signal monitor</p>
                  <p data-testid="status-signal" aria-live="polite" className="mt-2 flex items-center gap-2 text-sm font-medium">
                    <span className={`h-2 w-2 rounded-full ${isRunning ? 'bg-primary' : 'bg-muted-foreground/45'}`} />
                    {status}
                  </p>
                </div>
                <AudioLines size={21} className={isRunning ? 'text-primary' : 'text-muted-foreground'} />
              </div>
              <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-xl border border-border bg-background/70 px-3">
                <div className={`signal-orb absolute h-24 w-24 rounded-full border border-primary/15 bg-primary/5 ${isRunning ? 'is-active' : ''}`} />
                <div className="relative flex h-24 w-full items-center justify-center gap-[3px]">
                  {bars.map((bar, index) => (
                    <div
                      key={index}
                      className={`signal-bar w-full max-w-[7px] rounded-full bg-primary/80 ${isRunning ? 'is-active' : ''}`}
                      style={{ height: `${bar * 78}px`, '--delay': `${index * 32}ms` } as CSSProperties}
                    />
                  ))}
                </div>
                <div className="absolute bottom-2 left-3 right-3 flex justify-between font-mono text-[9px] uppercase tracking-[.15em] text-muted-foreground/60">
                  <span>low</span><span>energy shape</span><span>high</span>
                </div>
              </div>
              <button
                type="button"
                data-testid="button-toggle-signal"
                onClick={toggleSignal}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card active:translate-y-0 ${isRunning ? 'border border-accent/40 bg-accent/10 text-accent' : 'bg-primary text-primary-foreground'}`}
              >
                {isRunning ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
                {isRunning ? 'Stop signal' : 'Start signal'}
              </button>
              {!audioSupported && (
                <p className="mt-3 text-xs leading-5 text-accent">Web Audio is not available here. The controls still show the selected values.</p>
              )}
            </section>

            <section className="rise-in rounded-[1.6rem] border border-border bg-card p-5 shadow-[var(--shadow-sm)] [animation-delay:140ms] sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.22em] text-muted-foreground">Strength</p>
                  <p className="mt-1 text-sm text-foreground">Output level</p>
                </div>
                <span data-testid="text-intensity-value" className="font-mono text-xl text-primary">{intensity}%</span>
              </div>
              <input
                aria-label="Signal strength"
                data-testid="input-intensity"
                type="range"
                min="0"
                max="100"
                value={intensity}
                onChange={(event) => {
                  setIntensity(Number(event.target.value));
                  setPreset('custom');
                  setStatus('Custom strength selected');
                }}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-foreground [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-foreground [&::-moz-range-thumb]:bg-primary"
              />
              <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground"><span>Quiet</span><span>Stronger</span></div>
            </section>

            <section className="rise-in rounded-[1.6rem] border border-border bg-card p-5 shadow-[var(--shadow-sm)] [animation-delay:200ms] sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.22em] text-muted-foreground">Pest library / {presets.length} references</p>
                  <p className="mt-1 text-sm text-foreground">Choose a subject to explore</p>
                </div>
                <Bug size={18} className="mt-1 shrink-0 text-primary" />
              </div>
              <label className="relative block">
                <span className="sr-only">Search pests</span>
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  aria-label="Search pests"
                  data-testid="input-pest-search"
                  value={pestSearch}
                  onChange={(event) => setPestSearch(event.target.value)}
                  placeholder="Search pests"
                  className="h-10 w-full rounded-xl border border-border bg-background/40 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setPestCategory(category)}
                    className={`shrink-0 rounded-full border px-2.5 py-1.5 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${pestCategory === category ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-muted-foreground/50'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="mt-3 max-h-[410px] space-y-2 overflow-y-auto pr-1">
                {visiblePresets.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    data-testid={`button-preset-${item.id}`}
                    onClick={() => choosePreset(item)}
                    className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${preset === item.id ? 'border-primary/60 bg-primary/10' : 'border-border bg-background/30 hover:border-muted-foreground/50'}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${preset === item.id ? 'bg-primary text-primary-foreground shadow-[0_0_14px_hsl(var(--primary)/.28)]' : 'bg-secondary text-muted-foreground'}`}>
                        <Icons8PestIcon id={item.id} active={preset === item.id && isRunning} compact />
                      </span>
                      <span>
                        <span className="block text-sm font-medium">{item.label}</span>
                        <span className="block text-[11px] text-muted-foreground">{item.category} · {item.note}</span>
                      </span>
                    </span>
                    <span className="shrink-0 pl-2 text-right font-mono text-[10px] text-muted-foreground">{formatFrequency(item.referenceHz)}</span>
                  </button>
                ))}
                {visiblePresets.length === 0 && (
                  <p className="rounded-xl border border-dashed border-border px-3 py-5 text-center text-xs text-muted-foreground">
                    No pests match that search.
                  </p>
                )}
              </div>
              <p className="mt-3 text-[11px] leading-4 text-muted-foreground">
                Reference frequencies are starting points for experiments, not proven repellent settings.
              </p>
            </section>
          </aside>

          <section className="lg:col-span-2">
            <div className="grid gap-5 rounded-[1.6rem] border border-accent/25 bg-accent/5 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                <ShieldCheck size={21} />
              </div>
              <div className="sm:px-2">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><Info size={15} className="text-accent" /> A note about the hardware</p>
                <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground sm:text-sm">
                   This page creates a signal through your browser and connected speakers. Most built-in speakers cannot reproduce true ultrasonic frequencies, and there is no single proven frequency for every pest. Treat these values as experiment starting points, not a proven control method.
                </p>
              </div>
              <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                <CircleHelp size={15} />
                <span>Stay curious</span>
              </div>
            </div>
          </section>
        </div>

        <footer className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-5 pb-8 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p className="flex items-center gap-2"><Gauge size={13} /> Frequency values are approximate browser output.</p>
          <p className="font-mono uppercase tracking-[.16em]">Nightwatch / v1.0 · <a className="underline underline-offset-2 hover:text-primary" href="https://icons8.com/" target="_blank" rel="noreferrer">Icons8</a> · <a className="underline underline-offset-2 hover:text-primary" href="https://thenounproject.com/icon/cricket-insect-1976090/" target="_blank" rel="noreferrer">Noun Project</a></p>
        </footer>
      </div>
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

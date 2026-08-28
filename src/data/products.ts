import { Product, ColorOption } from '../types';

export const PINK_SHADES: ColorOption[] = [
  { name: 'Rose Quartz', hex: '#F472B6' },
  { name: 'Blush Silk', hex: '#FDA4AF' },
  { name: 'Dusty Rose', hex: '#E879F9' },
  { name: 'Petal Crimson', hex: '#F43F5E' },
  { name: 'Pale Shell', hex: '#FFE4E6' },
  { name: 'Deep Dahlia', hex: '#BE123C' },
];

export const FABRIC_OPTIONS = [
  { 
    id: 'silk', 
    name: '100% Mulberry Silk', 
    desc: 'Weight: 22 momme, fluid drape with subtle luminous luster',
    multiplier: 1.45 
  },
  { 
    id: 'linen', 
    name: 'Heavyweight Belgian Linen', 
    desc: 'Pre-washed 240 GSM, breathable, textured artisanal weave',
    multiplier: 1.15 
  },
  { 
    id: 'wool', 
    name: 'Italian Super 120s Virgin Wool', 
    desc: 'Refined structured drape, season-spanning thermal balance',
    multiplier: 1.55 
  },
  { 
    id: 'cotton', 
    name: 'Organic Long-Staple Pima Cotton', 
    desc: 'Crisp poplin finish, OEKO-TEX certified organic',
    multiplier: 1.0 
  },
  { 
    id: 'cashmere', 
    name: 'Double-Faced Cashmere Blend', 
    desc: 'Ultra-soft handfeel, unlined sculptural construction',
    multiplier: 1.85 
  }
];

export const SILHOUETTE_OPTIONS = [
  { id: 'blazer', name: 'Tailored Blazer & Suit', basePrice: 380 },
  { id: 'dress', name: 'Bespoke Evening / Slip Dress', basePrice: 310 },
  { id: 'trench', name: 'Minimalist Belted Coat / Trench', basePrice: 460 },
  { id: 'shirt', name: 'Architectural Poplin Shirt', basePrice: 190 },
  { id: 'trousers', name: 'Pleated High-Waist Trousers', basePrice: 240 },
  { id: 'custom', name: 'One-of-a-Kind Atelier Design', basePrice: 520 }
];

export const PRODUCTS: Product[] = [
  {
    id: 'rose-tailored-blazer',
    name: 'The Atelier Sculpted Blazer',
    tagline: 'Single-breasted wool-silk architecture with soft padded shoulders.',
    category: 'Outerwear',
    price: 420,
    originalPrice: 490,
    rating: 4.9,
    reviewsCount: 38,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blush Silk', hex: '#FDA4AF' },
      { name: 'Petal Crimson', hex: '#F43F5E' },
      { name: 'Pale Shell', hex: '#FFF1F2' }
    ],
    description: 'A masterclass in modern proportion. Crafted from fine virgin wool woven with mulberry silk in our signature rose tone. Features clean horn buttons, interior welt pockets, and a clean notched lapel engineered to flatter both relaxed and formal silhouettes.',
    details: [
      'Structured shoulder line with light natural canvassing',
      'Double back vents for fluid movement',
      'Hand-finished horn buttons dyed in blush',
      'Fully lined with 100% breathable cupro'
    ],
    materials: '75% Italian Virgin Wool, 25% Mulberry Silk. Lining: 100% Cupro.',
    care: 'Specialist dry clean only. Steam gently.',
    inStock: true,
    badge: 'Signature Piece',
    quoteAvailable: true,
    featured: true
  },
  {
    id: 'rose-silk-slip-dress',
    name: 'L’Aube Bias-Cut Silk Dress',
    tagline: '22-momme pure silk charmeuse with delicate French seams.',
    category: 'Dresses',
    price: 340,
    rating: 4.8,
    reviewsCount: 52,
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Rose Quartz', hex: '#F472B6' },
      { name: 'Pale Shell', hex: '#FFE4E6' },
      { name: 'Deep Dahlia', hex: '#BE123C' }
    ],
    description: 'Effortlessly sensual with an undulating bias drape. Floats across the silhouette without clinging. Finished with delicate adjustable micro-straps and low back detailing. Can be ordered in custom measurements via our quote studio.',
    details: [
      'Cut on the bias for natural, organic stretch and drape',
      'Subtle cowl neckline with interior stay-tape',
      'French-seamed throughout for clean durability',
      'Ankle-grazing length with side split'
    ],
    materials: '100% Grade 6A Mulberry Silk Charmeuse.',
    care: 'Dry clean or cold hand wash with neutral silk detergent.',
    inStock: true,
    badge: 'Atelier Favorite',
    quoteAvailable: true,
    featured: true
  },
  {
    id: 'rose-belted-trench',
    name: 'Minimalist Rose Drape Trench',
    tagline: 'Water-resistant double-weave poplin with detachable storm flap.',
    category: 'Outerwear',
    price: 520,
    originalPrice: 580,
    rating: 5.0,
    reviewsCount: 24,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Pale Shell', hex: '#FFE4E6' },
      { name: 'Dusty Rose', hex: '#E879F9' }
    ],
    description: 'An architectural reinterpretation of the classic trench coat. Cut with dropped raglan sleeves, a minimal storm shield, and an extended self-tie sash that cinches the waist sculpturally.',
    details: [
      'Water-repellent ecological finish',
      'Convertible collar with concealed storm latch',
      'Deep welt storm pockets',
      'Unstructured back yoke for a modern relaxed fall'
    ],
    materials: '68% Organic Cotton, 32% Recycled Polyamide.',
    care: 'Specialist dry clean.',
    inStock: true,
    badge: 'Limited Run',
    quoteAvailable: true,
    featured: true
  },
  {
    id: 'rose-pleated-trousers',
    name: 'Palais Pleated High-Waist Trouser',
    tagline: 'Double-front pleats in fluid Belgian linen-tencel blend.',
    category: 'Trousers',
    price: 260,
    rating: 4.7,
    reviewsCount: 41,
    images: [
      'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blush Silk', hex: '#FDA4AF' },
      { name: 'Pale Shell', hex: '#FFE4E6' }
    ],
    description: 'Tailored for movement and ease. Featuring deep inward-facing knife pleats that release into an elegant wide-leg line. Inner curtain waistband construction ensures trousers stay anchored securely at high waist.',
    details: [
      'Deep double front pleats',
      'Extended tab closure with hidden hook and bar',
      'Slanted side trouser pockets and clean back welt pocket',
      'Generous 2-inch hem allowance for custom inseam alterations'
    ],
    materials: '60% Belgian Linen, 40% Tencel Lyocell.',
    care: 'Machine wash delicate cycle 30°C or dry clean.',
    inStock: true,
    quoteAvailable: true,
    featured: false
  },
  {
    id: 'rose-cashmere-knit',
    name: 'Cloud-Knit Pure Cashmere Crew',
    tagline: 'Ultralight 7-gauge Mongolian cashmere in whisper rose.',
    category: 'Knitwear',
    price: 295,
    rating: 4.9,
    reviewsCount: 67,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Rose Quartz', hex: '#F472B6' },
      { name: 'Pale Shell', hex: '#FFF1F2' }
    ],
    description: 'Knitted from ethical grade-A Mongolian cashmere fiber. Fluffy, featherweight warmth with ribbed neck trim that maintains shape season after season. Layer over our slip dresses or tuck into tailored trousers.',
    details: [
      '7-gauge seamless knit construction',
      'Subtle tubular rib finish on cuffs and hem',
      'Zero synthetic blend guarantees lifetime softness',
      'Hypoallergenic and naturally breathable'
    ],
    materials: '100% Grade-A Mongolian Cashmere.',
    care: 'Hand wash cold with wool wash, dry flat on towel.',
    inStock: true,
    badge: 'Best Seller',
    quoteAvailable: true,
    featured: true
  },
  {
    id: 'rose-poplin-shirt',
    name: 'The Essentialist Oversized Shirt',
    tagline: '120-yarn Egyptian cotton with sculptural point collar.',
    category: 'Tops',
    price: 185,
    rating: 4.8,
    reviewsCount: 33,
    images: [
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pale Shell', hex: '#FFE4E6' },
      { name: 'Rose Quartz', hex: '#F472B6' }
    ],
    description: 'A perennial staple with an artful twist. Engineered with dropped shoulders, exaggerated double-button cuffs, and mother-of-pearl buttons. Wear loose, tucked, or unbuttoned over a bralette.',
    details: [
      '120/2 two-ply high-density Egyptian cotton poplin',
      'Curved high-low shirttail hem',
      'Genuine Australian mother-of-pearl buttons',
      'Pre-shrunk for consistent fit through washes'
    ],
    materials: '100% GOTS-Certified Egyptian Cotton.',
    care: 'Machine wash 40°C. Warm iron while slightly damp.',
    inStock: true,
    quoteAvailable: true,
    featured: false
  },
  {
    id: 'rose-leather-tote',
    name: 'Petal Minimalist Leather Tote',
    tagline: 'Full-grain Italian calfskin with micro-suede interior.',
    category: 'Accessories',
    price: 360,
    rating: 4.9,
    reviewsCount: 19,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['M'],
    colors: [
      { name: 'Dusty Rose', hex: '#E879F9' },
      { name: 'Blush Silk', hex: '#FDA4AF' },
      { name: 'Deep Dahlia', hex: '#BE123C' }
    ],
    description: 'Sculpted from supple vegetable-tanned leather in a timeless rectangular silhouette. Features magnetic closure, interior zip pouch that detaches, and reinforced handles designed to rest comfortably on the shoulder.',
    details: [
      'Vegetable-tanned full-grain leather',
      'Fits up to 15-inch laptop and daily essentials',
      'Detachable interior zip wristlet pouch included',
      'Discreet blind-embossed studio logo'
    ],
    materials: '100% Italian Calf Leather, bonded suede lining.',
    care: 'Wipe with soft damp cloth. Condition annually.',
    inStock: true,
    badge: 'Artisanal',
    quoteAvailable: true,
    featured: false
  },
  {
    id: 'rose-column-skirt',
    name: 'Solstice Column Maxi Skirt',
    tagline: 'High-waisted raw silk weave with back walking vent.',
    category: 'Trousers',
    price: 240,
    rating: 4.6,
    reviewsCount: 15,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Blush Silk', hex: '#FDA4AF' },
      { name: 'Petal Crimson', hex: '#F43F5E' }
    ],
    description: 'Floor-skimming column silhouette that elongates the frame. Made from slubby raw silk that gives textural richness to monochrome styling. Concealed side zip ensures uninterrupted waistline.',
    details: [
      'Textured raw silk noil fabric with natural slub',
      'Concealed invisible YKK side zip',
      'Deep back vent for fluid walking stride',
      'Internal silk ribbon hanging loops'
    ],
    materials: '100% Raw Silk Noil.',
    care: 'Dry clean recommended or gentle hand wash cold.',
    inStock: true,
    quoteAvailable: true,
    featured: false
  }
];

export const INITIAL_QUOTES = [
  {
    id: 'QR-2026-8941',
    createdAt: '2026-08-27T10:30:00Z',
    clientName: 'Elena Rostova',
    clientEmail: 'elena.rostova@atelier.co',
    clientPhone: '+1 (555) 392-1044',
    projectType: 'bespoke_single' as const,
    garmentSilhouette: 'Tailored Blazer & Suit',
    fabricType: 'Italian Super 120s Virgin Wool',
    pinkTone: { name: 'Blush Silk', hex: '#FDA4AF' },
    targetQuantity: 1,
    estimatedBudget: 589,
    measurements: {
      bust: '34 in',
      waist: '26 in',
      hips: '36 in',
      height: '5 ft 8 in',
      unit: 'in' as const
    },
    notes: 'Looking for a bespoke double-breasted cut with peak lapels for an autumn gallery vernissage.',
    targetTimeline: 'standard' as const,
    status: 'Pattern Drafting' as const,
    relatedProductName: 'The Atelier Sculpted Blazer'
  },
  {
    id: 'QR-2026-7812',
    createdAt: '2026-08-25T14:15:00Z',
    clientName: 'Chloe Bennett',
    clientEmail: 'chloe.b@lumierestudio.com',
    clientPhone: '+1 (555) 749-8231',
    projectType: 'bridal_event' as const,
    garmentSilhouette: 'Bespoke Evening / Slip Dress',
    fabricType: '100% Mulberry Silk',
    pinkTone: { name: 'Rose Quartz', hex: '#F472B6' },
    targetQuantity: 5,
    estimatedBudget: 2247,
    notes: 'Custom bridal party slip gowns in Rose Quartz with custom cowl back depths and tailored lengths.',
    targetTimeline: 'standard' as const,
    status: 'Material Sourcing' as const,
    relatedProductName: 'L’Aube Bias-Cut Silk Dress'
  }
];

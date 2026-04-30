
import { useState, useRef, FormEvent, useEffect } from 'react';
import { CustomCalendar } from './components/CustomCalendar';
import { differenceInDays, parseISO } from 'date-fns';
import { 
  Search, 
  Calendar, 
  Users, 
  Dog, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Wifi,
  Waves,
  UtensilsCrossed,
  Tv,
  Wind,
  ParkingCircle,
  ShieldCheck,
  Coffee,
  ArrowRight,
  Maximize2,
  Globe,
  Compass,
  Bike,
  Car,
  Footprints,
  Palmtree,
  Map,
  PackageCheck,
  StickyNote,
  Loader2,
  Check,
  Layout,
  WashingMachine,
  Refrigerator,
  ArrowUpCircle,
  Fan,
  ThermometerSun
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { translations, Language } from './lib/translations';

const OcenaLogo = ({ className = "w-8 h-8", strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth}
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Sun */}
    <circle cx="50" cy="40" r="18" />
    {/* Rays */}
    <line x1="50" y1="12" x2="50" y2="18" />
    <line x1="28" y1="20" x2="33" y2="25" />
    <line x1="72" y1="20" x2="67" y2="25" />
    <line x1="18" y1="40" x2="24" y2="40" />
    <line x1="82" y1="40" x2="76" y2="40" />
    
    {/* Waves */}
    <path d="M10 65 Q 30 50, 50 65 T 90 65" />
    <path d="M15 78 Q 35 63, 55 78 T 85 78" />
  </svg>
);

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  const [searchData, setSearchData] = useState({
    type: t.search.shortTermOpt,
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    pets: false
  });
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showBookingSection, setShowBookingSection] = useState(false);
  const [viewingGallery, setViewingGallery] = useState<any>(null); // Using any for simplicity in this transition
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showSearchCalendar, setShowSearchCalendar] = useState(false);
  const [showBookingCalendar, setShowBookingCalendar] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    quantity: 1 as any,
    pets: 'Không mang vật nuôi',
    term: '',
    price: ''
  });
  const [formErrors, setFormErrors] = useState({
    phone: '',
    email: '',
    fullName: ''
  });
  
  const bookingFormRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const roomsRef = useRef<HTMLElement>(null);

  const isSearchComplete = searchData.checkIn !== '' && searchData.checkOut !== '' && searchData.adults > 0;

  const openGallery = (data: any) => {
    setViewingGallery(data);
    setCurrentImageIndex(0);
  };

  const AMENITIES = [
    { icon: 'Waves', name: t.amenities.list.oceanAir, desc: t.amenities.list.oceanAirDesc, details: t.amenities.list.oceanAirDetails },
    { icon: 'ArrowUpCircle', name: t.amenities.list.elevator, desc: t.amenities.list.elevatorDesc, details: t.amenities.list.elevatorDetails },
    { icon: 'Fan', name: t.amenities.list.airExchange, desc: t.amenities.list.airExchangeDesc, details: t.amenities.list.airExchangeDetails },
    { icon: 'ThermometerSun', name: t.amenities.list.heatPump, desc: t.amenities.list.heatPumpDesc, details: t.amenities.list.heatPumpDetails },
    { icon: 'Wifi', name: t.amenities.list.wifi, desc: t.amenities.list.wifiDesc, details: t.amenities.list.wifiDetails },
    { icon: 'Coffee', name: t.amenities.list.balcony, desc: t.amenities.list.balconyDesc, details: t.amenities.list.balconyDetails },
    { icon: 'ShieldCheck', name: t.amenities.list.security, desc: t.amenities.list.securityDesc, details: t.amenities.list.securityDetails },
    { icon: 'UtensilsCrossed', name: t.amenities.list.kitchen, desc: t.amenities.list.kitchenDesc, details: t.amenities.list.kitchenDetails },
    { icon: 'Wind', name: t.amenities.list.ac, desc: t.amenities.list.acDesc, details: t.amenities.list.acDetails },
    { icon: 'Tv', name: t.amenities.list.tv, desc: t.amenities.list.tvDesc, details: t.amenities.list.tvDetails },
    { icon: 'Refrigerator', name: t.amenities.list.fridge, desc: t.amenities.list.fridgeDesc, details: t.amenities.list.fridgeDetails },
    { icon: 'WashingMachine', name: t.amenities.list.laundry, desc: t.amenities.list.laundryDesc, details: t.amenities.list.laundryDetails },
  ];

  const ROOM_TYPES = [
    {
      id: 'rest-studio',
      name: 'Rest Studio',
      shortTerm: '450.000đ',
      monthly: '8.000.000đ',
      image: 'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_600/v1774931592/Rest-apartment-Studio-Ocena-Mykhe-Danang-43_rq4t8a.jpg',
      gallery: [
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931592/Rest-apartment-Studio-Ocena-Mykhe-Danang-43_rq4t8a.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931592/Rest-apartment-Studio-Ocena-Mykhe-Danang-44_uxiwe9.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931594/Rest-apartment-Studio-Ocena-Mykhe-Danang-45_uttehc.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931591/Rest-apartment-Studio-Ocena-Mykhe-Danang-42_ypqy5y.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931595/Rest-apartment-Studio-Ocena-Mykhe-Danang-46_gir4mv.jpg'
      ],
      description: t.roomDescription.restStudio,
      features: [t.roomFeatures.queenBed, t.roomFeatures.quiet, t.roomFeatures.fullAmenities],
      included: [t.includedItems.toiletries, t.includedItems.linens, t.includedItems.bottledWater, t.includedItems.hairdryer],
      rules: [t.roomRules.quietHours, t.roomRules.noSmoking, t.roomRules.checkIn, t.roomRules.checkOut]
    },
    {
      id: 'garden-studio',
      name: 'Garden view Studio',
      shortTerm: '600.000đ',
      monthly: '11.000.000đ',
      image: 'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_600/v1774931567/Gargen-view-Studio-Ocena-Mykhe-Danang-14_noy0el.jpg',
      gallery: [
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931566/Gargen-view-Studio-Ocena-Mykhe-Danang-11_pff6z6.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931569/Gargen-view-Studio-Ocena-Mykhe-Danang-26_txsqdz.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931567/Gargen-view-Studio-Ocena-Mykhe-Danang-15_a12qea.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931571/Gargen-view-Studio-Ocena-Mykhe-Danang-30_xsi4jp.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931568/Gargen-view-Studio-Ocena-Mykhe-Danang-16_ukxr3z.jpg'
      ],
      description: t.roomDescription.gardenStudio,
      features: [t.roomFeatures.gardenView, t.roomFeatures.miniKitchen, t.roomFeatures.workspace],
      included: [t.includedItems.toiletries, t.includedItems.linens, t.includedItems.kitchenware, t.includedItems.bottledWater],
      rules: [t.roomRules.quietHours, t.roomRules.noSmoking, t.roomRules.petsAllowed, t.roomRules.checkIn]
    },
    {
      id: 'seaside-studio',
      name: 'Seaside Studio',
      shortTerm: '650.000đ',
      monthly: '12.000.000đ',
      image: 'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_600/v1774931576/Seaside-view-Studio-Ocena-Mykhe-Danang-17_qpbjve.jpg',
      gallery: [
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931577/Seaside-view-Studio-Ocena-Mykhe-Danang-18_k114jm.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931579/Seaside-view-Studio-Ocena-Mykhe-Danang-21_qjuwym.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931580/Seaside-view-Studio-Ocena-Mykhe-Danang-23_afyeet.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931580/Seaside-view-Studio-Ocena-Mykhe-Danang-22_jzcriv.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931581/Seaside-view-Studio-Ocena-Mykhe-Danang-24_ehinzb.jpg'
      ],  
      description: t.roomDescription.seasideStudio,
      features: [t.roomFeatures.oceanView, t.roomFeatures.miniKitchen, t.roomFeatures.workspace],
      included: [t.includedItems.toiletries, t.includedItems.linens, t.includedItems.kitchenware, t.includedItems.bottledWater, t.includedItems.slippers],
      rules: [t.roomRules.quietHours, t.roomRules.noSmoking, t.roomRules.checkIn, t.roomRules.checkOut]
    },
    {
      id: '2br',
      name: t.roomFeatures.twoBrLabel,
      shortTerm: '950.000đ',
      monthly: '18.000.000đ',
      image: 'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_600/v1774931553/2BR-apartment-Ocena-Mykhe-Danang-2_v5ysde.jpg',
      gallery: [
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931552/2BR-apartment-Ocena-Mykhe-Danang-1_b7lxi1.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931555/2BR-apartment-Ocena-Mykhe-Danang-6_pdoffl.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931557/2BR-apartment-Ocena-Mykhe-Danang-39_elbrcp.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931555/2BR-apartment-Ocena-Mykhe-Danang-7_qmogwv.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_800/v1774931556/2BR-apartment-Ocena-Mykhe-Danang-8_utzvoc.jpg'
      ],
      description: t.roomDescription.twoBr,
      features: [t.roomFeatures.twoBrPrivate, t.roomFeatures.twoBath, t.roomFeatures.livingRoom, t.roomFeatures.fullKitchen],
      included: [t.includedItems.toiletries, t.includedItems.linens, t.includedItems.kitchenware, t.includedItems.bottledWater, t.includedItems.hairdryer, t.includedItems.slippers],
      rules: [t.roomRules.quietHours, t.roomRules.noSmoking, t.roomRules.noParties, t.roomRules.checkIn, t.roomRules.checkOut]
    }
  ];

  const COMMON_SPACES = [
    {
      id: 'lobby',
      title: t.commonSpaces.lobby,
      image: 'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1774931546/Rent-apartment-Studio-Ocena-Mykhe-Danang-83_w0u1lk.jpg',
      description: t.commonSpaces.lobbyDesc,
      gallery: [
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1774931544/Rent-apartment-Studio-Ocena-Mykhe-Danang-77_xidlha.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1774931546/Rent-apartment-Studio-Ocena-Mykhe-Danang-83_w0u1lk.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1774931545/Rent-apartment-Studio-Ocena-Mykhe-Danang-78_p4y4dc.jpg'
      ],
      features: ['Modern Lobby', 'Multi-purpose', 'Social Space'],
      isCommonSpace: true
    },
    {
      id: 'surroundings',
      title: t.commonSpaces.surroundings,
      image: 'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1774931549/Rent-apartment-Studio-Ocena-Mykhe-Danang-88_wmasgh.jpg',
      description: t.commonSpaces.surroundingsDesc,
      gallery: [
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1774931545/Rent-apartment-Studio-Ocena-Mykhe-Danang-79_ysjmwb.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1774931549/Rent-apartment-Studio-Ocena-Mykhe-Danang-89_rjlmir.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1774931546/Rent-apartment-Studio-Ocena-Mykhe-Danang-82_huifnk.jpg'
      ],
      features: ['Quiet Area', 'Tropical Greenery', 'Sea Breeze'],
      isCommonSpace: true
    },
    {
      id: 'balcony',
      title: t.commonSpaces.oceanBalcony,
      image: 'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1774931543/Rent-apartment-Studio-Ocena-Mykhe-Danang-73_hxvszj.jpg',
      description: t.commonSpaces.oceanBalconyDesc,
      gallery: [
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1774931538/Rent-apartment-Studio-Ocena-Mykhe-Danang-31_ir2h5x.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1774931541/Rent-apartment-Studio-Ocena-Mykhe-Danang-67_nikvju.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1774931543/Rent-apartment-Studio-Ocena-Mykhe-Danang-73_hxvszj.jpg'
      ],
      features: ['Ocean View', 'Outdoor Work', 'Relaxing Spot'],
      isCommonSpace: true
    },
    {
      id: 'rooftop',
      title: t.commonSpaces.rooftop,
      image: 'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1774931542/Rent-apartment-Studio-Ocena-Mykhe-Danang-69_mkgado.jpg',
      description: t.commonSpaces.rooftopDesc,
      gallery: [
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1774931543/Rent-apartment-Studio-Ocena-Mykhe-Danang-70_zqv0k4.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1774931542/Rent-apartment-Studio-Ocena-Mykhe-Danang-68_ikq1up.jpg',
        'https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1774931539/Rent-apartment-Studio-Ocena-Mykhe-Danang-37_ujy2cp.jpg'
      ],
      features: ['Panoramic View', 'Laundry Space', 'Exercise Area'],
      isCommonSpace: true
    }
  ];

  const EXPERIENCES = [
    { icon: UtensilsCrossed, title: t.experience.food, desc: t.experience.foodDesc },
    { icon: Compass, title: t.experience.attractions, desc: t.experience.attractionsDesc },
    { icon: Palmtree, title: t.experience.beach, desc: t.experience.beachDesc }
  ];

  const MOBILITY = [
    { icon: Map, title: t.gettingAround.grab, desc: t.gettingAround.grabDesc },
    { icon: Bike, title: t.gettingAround.motorbike, desc: t.gettingAround.motorbikeDesc },
    { icon: Footprints, title: t.gettingAround.walking, desc: t.gettingAround.walkingDesc }
  ];

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const handleBookNowTrigger = () => {
    setShowBookingSection(true);
    setBookingStatus('idle');
    if (!selectedRoom) {
      roomsRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      scrollToForm();
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!isSearchComplete) {
      alert(t.booking.alertSearchIncomplete);
      return;
    }
    setShowBookingSection(true);
    if (!selectedRoom) {
      roomsRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      scrollToForm();
    }
  };

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoom(roomId);
    setShowBookingSection(true);
    scrollToForm();
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value.trim() === '') {
        error = t.booking.enterEmail;
      } else if (!emailRegex.test(value)) {
        error = t.booking.invalidEmail;
      }
    } else if (name === 'phone') {
      const phoneRegex = /^(\+?\d{1,3})?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
      if (value.trim() === '') {
        error = t.booking.enterPhone;
      } else if (!phoneRegex.test(value) || value.length < 8) {
        error = t.booking.invalidPhone;
      }
    } else if (name === 'fullName') {
      if (value.trim() === '') {
        error = t.booking.enterFullName;
      }
    }
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleBookingSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    setBookingStatus('loading');
    
    // Replace this with your actual Google Apps Script URL
    const webAppUrl = "https://script.google.com/macros/s/AKfycbylVEtXDp5q6WUjnEJHolXHEzLHpZAkkfAGz5KdlalWW6pWcVNZrsInb5B5guYNFAa_/exec";
    
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    // Get values directly from form for display in success screen
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;

    // Validate all fields before submission
    const isNameValid = validateField('fullName', name);
    const isPhoneValid = validateField('phone', phone);
    const isEmailValid = validateField('email', email);

    if (!isNameValid || !isPhoneValid || !isEmailValid) {
      setBookingStatus('idle');
      // Scroll to the first error
      const firstError = document.querySelector('.text-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const roomType = ROOM_TYPES.find(r => r.id === selectedRoom)?.name || selectedRoom;
    const checkin = formData.get('checkin') as string;
    const checkout = formData.get('checkout') as string;
    const adults = formData.get('adults_count') || searchData.adults;
    const children = formData.get('children_count') || searchData.children;
    const term = formData.get('term') as string;
    const petsChecked = searchData.pets;
    
    const quantityString = lang === 'vi' 
      ? `${adults} người lớn, ${children} trẻ em` 
      : `${adults} adults, ${children} children`;
    
    formData.set('quantity', quantityString);
    formData.set('room_type', roomType);
    formData.set('pets', petsChecked ? (lang === 'vi' ? 'Có mang vật nuôi' : 'With Pets') : (lang === 'vi' ? 'Không mang vật nuôi' : 'No Pets'));
    
    // Clean up internal helper fields for Google Sheets submission
    formData.delete('adults_count');
    formData.delete('children_count');
    
    const currentRoom = ROOM_TYPES.find(r => r.id === selectedRoom);
    const calculatedPrice = currentRoom 
      ? (term === t.search.longTermOpt ? currentRoom.monthly : currentRoom.shortTerm) 
      : '';

    // Pass everything collected to set the form display values for confirmation
    setBookingFormData({
      fullName: name,
      phone: phone,
      email: email,
      quantity: quantityString as any,
      pets: petsChecked ? (lang === 'vi' ? 'Có mang vật nuôi' : 'With Pets') : (lang === 'vi' ? 'Không mang vật nuôi' : 'No Pets'),
      term: term,
      price: calculatedPrice
    } as any);

    try {
      await fetch(webAppUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });

      setBookingStatus('success');
    } catch (error) {
      console.error('Error sending request:', error);
      alert(lang === 'vi' ? "Có lỗi xảy ra. Vui lòng thử lại!" : "An error occurred. Please try again!");
      setBookingStatus('error');
    }
  };

  const handleBookAnother = () => {
    setBookingStatus('idle');
    setBookingFormData({
      fullName: '',
      phone: '',
      email: '',
      quantity: 1 as any,
      pets: 'Không mang vật nuôi',
      term: '',
      price: ''
    });
    // Optional: clear search data to start fresh or keep it
  };

  const nextImage = () => {
    if (viewingGallery) {
      setCurrentImageIndex((prev) => (prev + 1) % viewingGallery.gallery.length);
    }
  };

  const prevImage = () => {
    if (viewingGallery) {
      setCurrentImageIndex((prev) => (prev - 1 + viewingGallery.gallery.length) % viewingGallery.gallery.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!viewingGallery) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setViewingGallery(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingGallery]);

  useEffect(() => {
    if (viewingGallery) {
      setCurrentImageIndex(0);
    }
  }, [viewingGallery]);

  useEffect(() => {
    if (!viewingGallery || !viewingGallery.isCommonSpace) return;

    const intervalId = setInterval(() => {
      nextImage();
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(intervalId);
  }, [viewingGallery, currentImageIndex]);

  const scrollToForm = () => {
    setTimeout(() => {
      bookingFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-neutral selection:bg-ocean/20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-neutral/80 backdrop-blur-md border-b border-slate-100 overflow-hidden" role="banner">
        {/* Subtle Header Wave Animation */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ocean/20 to-transparent animate-pulse" aria-hidden="true"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-3 group">
              <div className="w-12 h-12 bg-ocean rounded-xl flex items-center justify-center shadow-lg shadow-ocean/10 transition-transform group-hover:scale-105" aria-hidden="true">
                <OcenaLogo className="text-gold w-8 h-8" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tighter text-ocean leading-none">OCENA</span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase mt-0.5">Apartment</span>
              </div>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center" aria-label="Main navigation">
              {[
                { name: t.nav.home, href: '#home' },
                { name: t.nav.rooms, href: '#rooms' },
                { name: t.nav.amenities, href: '#amenities' },
                { name: t.nav.contact, href: '#contact' }
              ].map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  className="text-sm font-semibold text-slate-600 hover:text-ocean transition-all relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ocean transition-all group-hover:w-full"></span>
                </a>
              ))}
              
              {/* Language Switcher */}
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-200" role="group" aria-label="Select language">
                <Globe size={16} className="text-slate-400" aria-hidden="true" />
                <button 
                  onClick={() => setLang('vi')}
                  aria-label="Vietnamese"
                  className={`text-xs font-bold transition-all ${lang === 'vi' ? 'text-ocean border-b-2 border-ocean' : 'text-slate-400 hover:text-ocean'}`}
                >
                  VN
                </button>
                <span className="text-slate-300" aria-hidden="true">|</span>
                <button 
                  onClick={() => setLang('en')}
                  aria-label="English"
                  className={`text-xs font-bold transition-all ${lang === 'en' ? 'text-ocean border-b-2 border-ocean' : 'text-slate-400 hover:text-ocean'}`}
                >
                  EN
                </button>
              </div>
            </nav>

            <div className="hidden md:block">
              <button 
                onClick={handleBookNowTrigger}
                className="bg-ocean text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-ocean/90 transition-all shadow-lg shadow-teal-900/10"
              >
                {t.nav.bookNow}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="text-slate-600"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="px-4 pt-2 pb-6 space-y-1 text-center">
                {[
                  { name: t.nav.home, href: '#home' },
                  { name: t.nav.rooms, href: '#rooms' },
                  { name: t.nav.amenities, href: '#amenities' },
                  { name: t.nav.contact, href: '#contact' }
                ].map((item) => (
                  <a key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-600 hover:text-ocean">
                    {item.name}
                  </a>
                ))}
                
                <div className="flex items-center gap-4 px-3 py-4 border-t border-slate-100">
                  <span className="text-sm font-bold text-slate-400 flex items-center gap-2">
                    <Globe size={16} /> Language:
                  </span>
                  <div className="flex gap-4">
                    <button onClick={() => { setLang('vi'); setIsMenuOpen(false); }} className={`font-bold ${lang === 'vi' ? 'text-ocean' : 'text-slate-400'}`}>VN</button>
                    <button onClick={() => { setLang('en'); setIsMenuOpen(false); }} className={`font-bold ${lang === 'en' ? 'text-ocean' : 'text-slate-400'}`}>EN</button>
                  </div>
                </div>

                <button 
                  onClick={() => { handleBookNowTrigger(); setIsMenuOpen(false); }}
                  className="w-full mt-4 bg-ocean text-white px-6 py-4 rounded-xl text-base font-semibold"
                >
                  {t.nav.bookNow}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-20 relative" role="main">
        {/* Tropical Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20" aria-hidden="true">
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 -left-20 w-96 h-96 text-ocean/10"
          >
            <svg viewBox="0 0 200 200" fill="currentColor">
              <path d="M100 20 C 120 40 130 70 100 100 C 70 70 80 40 100 20 M100 100 C 120 120 130 150 100 180 C 70 150 80 120 100 100" />
            </svg>
          </motion.div>
          <motion.div 
            animate={{ 
              y: [0, 30, 0],
              rotate: [0, -8, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] -right-20 w-[500px] h-[500px] text-ocean/5"
          >
            <svg viewBox="0 0 200 200" fill="currentColor">
              <path d="M100 20 C 120 40 130 70 100 100 C 70 70 80 40 100 20 M100 100 C 120 120 130 150 100 180 C 70 150 80 120 100 100" />
            </svg>
          </motion.div>
          <motion.div 
            animate={{ 
              y: [0, -40, 0],
              rotate: [0, 12, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 -left-32 w-[600px] h-[600px] text-ocean/5"
          >
            <svg viewBox="0 0 200 200" fill="currentColor">
              <path d="M100 20 C 120 40 130 70 100 100 C 70 70 80 40 100 20 M100 100 C 120 120 130 150 100 180 C 70 150 80 120 100 100" />
            </svg>
          </motion.div>
        </div>

        {/* Hero Section */}
        <section id="home" ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center py-32 z-40">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.img 
              style={{ y: backgroundY }}
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=75&w=1400" 
              alt="Coastal view" 
              className="w-full h-full object-cover scale-110"
              referrerPolicy="no-referrer"
              fetchPriority="high"
            />
            {/* Multi-layered overlay for better depth and readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-ocean/40 via-ocean/10 to-transparent"></div>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
            
            {/* Decorative mesh gradient for a modern professional touch */}
            <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-gold/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-ocean/20 blur-[100px] rounded-full pointer-events-none"></div>

            {/* Wave Transition */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-10 translate-y-[1px]">
              <svg className="relative block w-[calc(100%+1.3px)] h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.83C51.17,113.84,126.19,123.9,202.68,113.84,263.5,105.75,285.58,71.25,321.39,56.44Z" fill="#EFE9E1"></path>
              </svg>
            </div>
          </div>

          <div className="relative z-10 w-full flex flex-col items-center">
            <div className="text-center px-4 max-w-5xl mb-12 md:mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-md bg-white/5"
              >
                <span className="text-[10px] md:text-xs font-bold text-white tracking-[0.3em] uppercase">
                  {t.hero.slogan}
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-6xl md:text-[7rem] lg:text-[8.5rem] font-serif italic text-white mb-6 leading-[0.85] tracking-tight drop-shadow-2xl"
              >
                {t.hero.title}
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-6"
              >
                <p className="text-xl md:text-2xl text-white/95 font-medium max-w-2xl mx-auto leading-tight italic font-serif">
                  "{t.hero.subtitle}"
                </p>
                <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto font-light leading-relaxed">
                  {t.hero.description}
                </p>
              </motion.div>
            </div>

            {/* Optimized Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="w-[95%] md:w-full max-w-6xl px-4 relative z-[100]"
            >
              <div className="bg-white p-2 md:p-3 rounded-[32px] md:rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-100">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch md:items-center gap-1" aria-label="Search for rooms">
                  
                  {/* Stay Type Selector (Vertical) */}
                  <div className="flex-shrink-0 p-3 md:px-6 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center gap-1.5 min-w-[140px]">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5 text-center">{t.search.type}</span>
                    <div className="bg-slate-100/50 p-1 rounded-2xl flex flex-col gap-1">
                      {[t.search.shortTermOpt, t.search.longTermOpt].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSearchData({ ...searchData, type: option })}
                          className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all text-center ${
                            searchData.type === option 
                              ? "bg-white text-ocean shadow-sm" 
                              : "text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          {option.split(' (')[0]}
                        </button>
                      ))}
                    </div>
                    <div className="mt-1.5 text-center">
                      <p className="text-[7px] font-bold text-ocean/50 leading-tight animate-in fade-in slide-in-from-top-0.5 duration-300">
                        {searchData.type === t.search.shortTermOpt 
                          ? (lang === 'vi' ? '< 28 nights' : '< 28 nights')
                          : (lang === 'vi' ? '≥ 28 nights' : '≥ 28 nights')
                        }
                      </p>
                    </div>
                  </div>

                  {/* Dates Component (Balanced) */}
                  <div className="flex-[1.5] relative">
                    <div 
                      onClick={() => setShowSearchCalendar(!showSearchCalendar)}
                      className="flex flex-col md:flex-row items-center cursor-pointer group h-full"
                    >
                      <div className="flex-1 w-full p-3 md:px-8 text-left hover:bg-slate-50 transition-all rounded-3xl md:rounded-full relative">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{t.search.checkIn}</label>
                        <div className="text-sm font-semibold text-ocean">
                          {searchData.checkIn || 'YYYY-MM-DD'}
                        </div>
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-ocean transition-colors" size={16} />
                      </div>

                      <div className="flex items-center justify-center -mx-2 z-10 hidden md:flex">
                        <div className="w-7 h-7 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300">
                          <ArrowRight size={12} />
                        </div>
                      </div>

                      <div className="flex-1 w-full p-3 md:px-8 text-left hover:bg-slate-50 transition-all rounded-3xl md:rounded-full relative">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{t.search.checkOut}</label>
                        <div className="text-sm font-semibold text-ocean">
                          {searchData.checkOut || 'YYYY-MM-DD'}
                        </div>
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-ocean transition-colors" size={16} />
                      </div>
                    </div>

                    {/* Nights Indicator */}
                    {searchData.checkIn && searchData.checkOut && (
                      <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gold text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg z-20 animate-in zoom-in">
                        {differenceInDays(parseISO(searchData.checkOut), parseISO(searchData.checkIn))} {t.search.nights}
                      </div>
                    )}

                    {/* Search Calendar Popover */}
                    <AnimatePresence>
                      {showSearchCalendar && (
                        <>
                          <div className="fixed inset-0 z-[110]" onClick={() => setShowSearchCalendar(false)}></div>
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute top-full left-0 right-0 mt-4 z-[120] flex justify-center"
                          >
                            <CustomCalendar 
                              checkIn={searchData.checkIn}
                              checkOut={searchData.checkOut}
                              lang={lang}
                              t={t}
                              onRangeSelect={(range) => {
                                setSearchData(prev => ({ ...prev, ...range }));
                                if (range.checkIn && range.checkOut) {
                                  setShowSearchCalendar(false);
                                }
                              }}
                            />
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Guests Selector */}
                  <div className="flex-shrink-0 p-3 md:px-8 border-t md:border-t-0 md:border-l border-slate-100 text-left hover:bg-slate-50 transition-all rounded-3xl md:rounded-full cursor-pointer relative group min-w-[200px]">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{t.search.guests}</span>
                    
                    <div className="flex flex-col gap-2">
                       {/* Row 1: Adults */}
                       <div className="flex items-center justify-between gap-4">
                         <span className="text-[11px] font-bold text-slate-600">{t.search.adultsLabel}</span>
                         <div className="flex items-center gap-2 bg-slate-100/50 p-0.5 rounded-full">
                           <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); setSearchData({...searchData, adults: Math.max(1, searchData.adults - 1)}); }}
                            className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-slate-600 hover:bg-ocean hover:text-white transition-all shadow-sm"
                           >-</button>
                           <span className="text-xs font-bold w-4 text-center">{searchData.adults}</span>
                           <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); setSearchData({...searchData, adults: Math.min(10, searchData.adults + 1)}); }}
                            className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-slate-600 hover:bg-ocean hover:text-white transition-all shadow-sm"
                           >+</button>
                         </div>
                       </div>

                       {/* Row 2: Children */}
                       <div className="flex items-center justify-between gap-4">
                         <span className="text-[11px] font-bold text-slate-600">{t.search.childrenLabel}</span>
                         <div className="flex items-center gap-2 bg-slate-100/50 p-0.5 rounded-full">
                           <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); setSearchData({...searchData, children: Math.max(0, searchData.children - 1)}); }}
                            className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-slate-600 hover:bg-ocean hover:text-white transition-all shadow-sm"
                           >-</button>
                           <span className="text-xs font-bold w-4 text-center">{searchData.children}</span>
                           <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); setSearchData({...searchData, children: Math.min(10, searchData.children + 1)}); }}
                            className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-slate-600 hover:bg-ocean hover:text-white transition-all shadow-sm"
                           >+</button>
                         </div>
                       </div>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="p-2 flex-shrink-0">
                    <button type="submit" className="h-14 w-full md:w-14 md:h-14 bg-ocean text-white rounded-full font-bold hover:bg-ocean/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-teal-900/20 active:scale-[0.98]">
                      <Search size={22} /><span className="md:hidden">{t.search.searchBtn}</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Common Spaces Gallery */}
        <section className="py-16 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 text-secondary/15 pointer-events-none">
            <svg viewBox="0 0 200 200" fill="currentColor">
              <circle cx="100" cy="100" r="80" />
            </svg>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-ocean mb-4">{t.commonSpaces.title}</h2>
              <p className="text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                {t.commonSpaces.subtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
              {COMMON_SPACES.map((space, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative h-[450px] rounded-[32px] overflow-hidden shadow-xl cursor-pointer"
                  onClick={() => openGallery(space)}
                  role="listitem"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openGallery(space); }}
                  aria-label={`View gallery for ${space.title}`}
                >
                  {/* Photo Stack Effect */}
                  <div className="absolute inset-0 w-full h-full">
                    <img 
                      src={space.image} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                    <div className="absolute top-6 right-6 flex -space-x-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0" aria-hidden="true">
                      {space.gallery.slice(1, 3).map((img, i) => (
                        <div key={i} className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-lg">
                          <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      ))}
                      <div className="w-12 h-12 rounded-full border-2 border-white bg-ocean flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                        +{space.gallery.length}
                      </div>
                    </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-1 bg-gold rounded-full" />
                      <p className="text-xs font-bold text-gold uppercase tracking-[0.2em]">{space.description}</p>
                    </div>
                    <h3 className="text-2xl font-bold text-white leading-tight mb-2">{space.title}</h3>
                    <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
                      <Maximize2 size={14} aria-hidden="true" /> {t.common.clickToView}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Da Nang Experiences & Mobility Section */}
        <section className="py-16 bg-aqua/30 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Experience */}
              <div>
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-ocean rounded-xl flex items-center justify-center text-white" aria-hidden="true">
                      <Compass size={20} />
                    </div>
                    <h2 className="text-3xl font-bold text-ocean">{t.experience.title}</h2>
                  </div>
                  <p className="text-slate-600 font-light">{t.experience.subtitle}</p>
                </div>
                
                <div className="space-y-6">
                  {EXPERIENCES.map((exp, i) => {
                    const Icon = exp.icon;
                    return (
                      <motion.div 
                        key={i}
                        whileHover={{ x: 10 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-6"
                      >
                        <div className="w-12 h-12 bg-aqua rounded-2xl flex-shrink-0 flex items-center justify-center text-ocean" aria-hidden="true">
                          <Icon size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 mb-1">{exp.title}</h4>
                          <p className="text-sm text-slate-500 font-light">{exp.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Mobility */}
              <div>
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-white" aria-hidden="true">
                      <Car size={20} />
                    </div>
                    <h2 className="text-3xl font-bold text-ocean">{t.gettingAround.title}</h2>
                  </div>
                  <p className="text-slate-600 font-light">{t.gettingAround.subtitle}</p>
                </div>
                
                <div className="space-y-6">
                  {MOBILITY.map((mob, i) => {
                    const Icon = mob.icon;
                    return (
                      <motion.div 
                        key={i}
                        whileHover={{ x: 10 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-6"
                      >
                        <div className="w-12 h-12 bg-gold/10 rounded-2xl flex-shrink-0 flex items-center justify-center text-gold" aria-hidden="true">
                          <Icon size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 mb-1">{mob.title}</h4>
                          <p className="text-sm text-slate-500 font-light">{mob.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Room Types Section */}
        <section id="rooms" ref={roomsRef} className="py-12 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-ocean mb-6">{t.rooms.title}</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg font-light">{t.rooms.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {ROOM_TYPES.map((room) => (
                <motion.div 
                  key={room.id}
                  whileHover={{ y: -12, shadow: "0 25px 50px -12px rgba(0, 61, 77, 0.15)" }}
                  className="bg-aqua rounded-[40px] overflow-hidden shadow-2xl shadow-teal-900/5 border border-white/50 flex flex-col group transition-shadow duration-500"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={room.image} 
                      alt={room.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                      <button 
                        onClick={() => openGallery(room)}
                        aria-label={`${t.rooms.viewGallery} for ${room.name}`}
                        className="bg-white/20 backdrop-blur-md text-white w-full py-3 rounded-2xl font-bold border border-white/30 hover:bg-white hover:text-ocean transition-all active:scale-95"
                      >
                        {t.rooms.viewGallery}
                      </button>
                    </div>
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-ocean shadow-sm" aria-label="Room availability">
                      {t.rooms.available}
                    </div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col relative">
                    <button 
                      onClick={() => handleSelectRoom(room.id)}
                      aria-label={`${t.rooms.selectRoom} - ${room.name}`}
                      className="w-full py-4 mb-6 rounded-2xl bg-ocean text-white font-bold hover:bg-ocean/90 transition-all text-sm shadow-lg shadow-teal-900/10 active:scale-[0.98] relative z-10"
                    >
                      {t.rooms.selectRoom}
                    </button>

                    {/* Decorative Leaf for Card */}
                    <div className="absolute top-0 right-0 w-24 h-24 text-ocean/5 -mr-8 -mt-8 rotate-12 pointer-events-none">
                      <svg viewBox="0 0 200 200" fill="currentColor">
                        <path d="M100 20 C 120 40 130 70 100 100 C 70 70 80 40 100 20 M100 100 C 120 120 130 150 100 180 C 70 150 80 120 100 100" />
                      </svg>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 relative z-10">{room.name}</h3>
                    <p className="text-sm text-slate-500 mb-8 flex-grow leading-relaxed font-light">{room.description}</p>
                    
                    <div className="space-y-4 mb-8 bg-white/50 p-5 rounded-3xl border border-slate-100">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-medium">{t.rooms.shortTermPrice}</span>
                        <span className="font-bold text-ocean text-lg">{room.shortTerm}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-medium">{t.rooms.monthlyPrice}</span>
                        <span className="font-bold text-gold text-lg">{room.monthly}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Amenities Section */}
        <section id="amenities" className="py-32 relative overflow-hidden bg-slate-50/50">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ocean/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-ocean mb-6">{t.amenities.title}</h2>
              <p className="text-slate-500 leading-relaxed text-lg font-light">
                {t.amenities.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {AMENITIES.map((amenity) => {
                const Icon = {
                  Wifi, Waves, UtensilsCrossed, Tv, Wind, Layout, ShieldCheck, Coffee, 
                  WashingMachine, Refrigerator, Car, ArrowUpCircle, Fan, ThermometerSun
                }[amenity.icon] as any;
                
                return (
                  <div key={amenity.name} className="flex flex-col p-6 rounded-[32px] bg-white border border-white hover:border-ocean/20 hover:shadow-2xl hover:shadow-ocean/5 transition-all duration-500 group">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-aqua flex items-center justify-center text-ocean group-hover:bg-ocean group-hover:text-white transition-all duration-300 mb-4" aria-hidden="true">
                      <Icon size={24} />
                    </div>
                    
                    <h4 className="font-bold text-slate-800 text-base mb-2 group-hover:text-ocean transition-colors">{amenity.name}</h4>
                    <p className="text-[12px] text-slate-500 leading-relaxed mb-4 font-light">{amenity.desc}</p>
                    
                    {amenity.details && (
                      <div className="mt-auto pt-4 border-t border-slate-50">
                        <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
                          {amenity.details.map((detail: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                              <div className="w-1 h-1 rounded-full bg-gold/40 shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative group">
                <div className="overflow-hidden rounded-[40px] shadow-2xl">
                  <img 
                    src="https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1777300965/1-41_q9mwf1.webp" 
                    alt="Amenities Experience" 
                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gold text-white p-8 rounded-[32px] shadow-2xl hidden md:block z-20">
                  <p className="text-2xl font-bold mb-1">{t.amenities.featureTitle}</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-80">{t.amenities.featureSubtitle}</p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="overflow-hidden rounded-[40px] shadow-2xl">
                  <img 
                    src="https://res.cloudinary.com/dap0pojyl/image/upload/f_auto,q_auto,w_1000/v1777300965/Air_Flow_Sys_qmxeo6.webp" 
                    alt="Modern Systems" 
                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Amenities Grid */}
        <section className="py-16 bg-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-ocean mb-4">{t.facilities.title}</h2>
              <p className="text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                {t.facilities.intro}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Category: Kitchen */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-aqua/50 flex items-center justify-center text-ocean mb-6 group-hover:bg-ocean group-hover:text-white transition-all">
                  <UtensilsCrossed size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">{t.facilities.kitchen.title}</h3>
                <ul className="space-y-3">
                  {[
                    { name: t.facilities.kitchen.induction, desc: t.facilities.kitchen.inductionDesc },
                    { name: t.facilities.kitchen.microwave, desc: t.facilities.kitchen.microwaveDesc },
                    { name: t.facilities.kitchen.utensils, desc: t.facilities.kitchen.utensilsDesc },
                    { name: t.facilities.kitchen.tableware, desc: t.facilities.kitchen.tablewareDesc }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-slate-700">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Category: Smart Home & Comfort */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-aqua/50 flex items-center justify-center text-ocean mb-6 group-hover:bg-ocean group-hover:text-white transition-all">
                  <Tv size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">{t.facilities.entertainment.title}</h3>
                <ul className="space-y-3">
                  {[
                    { name: t.facilities.entertainment.tv, desc: t.facilities.entertainment.tvDesc },
                    { name: t.facilities.entertainment.wifi, desc: t.facilities.entertainment.wifiDesc },
                    { name: t.facilities.entertainment.workspace, desc: t.facilities.entertainment.workspaceDesc },
                    { name: t.facilities.entertainment.led, desc: t.facilities.entertainment.ledDesc }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-slate-700">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Category: Personal Care */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-aqua/50 flex items-center justify-center text-ocean mb-6 group-hover:bg-ocean group-hover:text-white transition-all">
                  <PackageCheck size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">{t.facilities.essentials.title}</h3>
                <ul className="space-y-3">
                  {[
                    { name: t.facilities.essentials.washer, desc: t.facilities.essentials.washerDesc },
                    { name: t.facilities.essentials.hairdryer, desc: t.facilities.essentials.hairdryerDesc },
                    { name: t.facilities.essentials.iron, desc: t.facilities.essentials.ironDesc },
                    { name: t.facilities.essentials.toiletries, desc: t.facilities.essentials.toiletriesDesc }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-slate-700">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Booking & Inquiry Form */}
        <AnimatePresence>
          {showBookingSection && (
            <motion.section 
              ref={bookingFormRef}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="py-24 bg-transparent"
            >
              <div className="max-w-4xl mx-auto px-4">
                <div className="bg-sand p-8 md:p-12 rounded-[40px] shadow-2xl relative">
                  <div className="absolute inset-0 rounded-[40px] overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 text-ocean/5 -mr-20 -mt-20 rotate-45">
                      <svg viewBox="0 0 200 200" fill="currentColor">
                        <path d="M100 20 C 120 40 130 70 100 100 C 70 70 80 40 100 20 M100 100 C 120 120 130 150 100 180 C 70 150 80 120 100 100" />
                      </svg>
                    </div>
                  </div>
                    <div className="relative z-10">
                      {bookingStatus === 'success' ? (
                        <div className="text-center space-y-8 py-8 animate-in fade-in zoom-in duration-500">
                          <div className="relative mx-auto w-24 h-24 mb-10">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                            <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl">
                              <Check size={48} />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                             <h3 className="text-3xl md:text-4xl font-black text-ocean">{lang === 'vi' ? 'Tuyệt vời! Yêu cầu của bạn đã được gửi' : 'Great! Your Request is Sent'}</h3>
                             <p className="text-slate-600 text-lg font-medium italic max-w-lg mx-auto">
                               {lang === 'vi' ? 'Cảm ơn bạn đã tin tưởng Ocena House. Chúng tôi sẽ liên hệ trong ít phút để hoàn tất đặt phòng!' : 'Thank you for choosing Ocena House. We will contact you shortly to finalize your stay!'}
                             </p>
                          </div>

                          <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-2xl text-left space-y-6 max-w-xl mx-auto relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-ocean/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                             
                             <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                               <StickyNote size={16} className="text-ocean" />
                               {lang === 'vi' ? 'Chi tiết yêu cầu' : 'Booking Summary'}
                             </h4>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                               <div className="space-y-1">
                                 <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">{lang === 'vi' ? 'Khách hàng' : 'Guest'}</span> 
                                 <span className="font-bold text-ocean text-lg">{bookingFormData.fullName}</span>
                               </div>
                               
                               <div className="space-y-1">
                                 <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">{lang === 'vi' ? 'Loại phòng' : 'Selected Room'}</span> 
                                 <span className="font-bold text-ocean text-lg">
                                   {selectedRoom === '2br' ? t.roomFeatures.twoBrLabel : 
                                    ROOM_TYPES.find(r => r.id === selectedRoom)?.name || selectedRoom || 'Rest Studio'}
                                 </span>
                               </div>

                               <div className="space-y-1">
                                 <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">{lang === 'vi' ? 'Kỳ hạn stay' : 'Stay Term'}</span> 
                                 <span className="font-bold text-ocean">{bookingFormData.term}</span>
                               </div>

                               <div className="space-y-1">
                                 <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">{lang === 'vi' ? 'Số lượng khách' : 'Total Guests'}</span> 
                                 <span className="font-bold text-ocean">{bookingFormData.quantity}</span>
                               </div>

                               <div className="space-y-1">
                                 <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">{lang === 'vi' ? 'Thú cưng' : 'Pets Status'}</span> 
                                 <span className="font-bold text-ocean flex items-center gap-2">
                                   <Dog size={14} className={bookingFormData.pets.includes('Có') || bookingFormData.pets.includes('With') ? 'text-gold' : 'text-slate-300'} />
                                   {bookingFormData.pets}
                                 </span>
                               </div>

                               <div className="space-y-1">
                                 <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">{lang === 'vi' ? 'Tiền phòng dự kiến' : 'Estimated Price'}</span> 
                                 <span className="font-black text-ocean text-xl">{(bookingFormData as any).price}</span>
                               </div>

                               <div className="space-y-1">
                                 <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">{lang === 'vi' ? 'Liên hệ' : 'Contact Information'}</span> 
                                 <div className="flex flex-col">
                                   <span className="font-bold text-ocean text-sm">{bookingFormData.phone}</span>
                                   <span className="text-slate-400 text-[10px]">{bookingFormData.email}</span>
                                 </div>
                               </div>

                               <div className="md:col-span-2 pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                                  <div className="space-y-1">
                                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">{lang === 'vi' ? 'Ngày Check-in' : 'Check-in'}</span>
                                    <span className="font-black text-ocean flex items-center gap-2">
                                      <Calendar size={14} className="text-gold" />
                                      {searchData.checkIn}
                                    </span>
                                  </div>
                                  <div className="h-8 w-px bg-slate-100"></div>
                                  <div className="space-y-1 text-right">
                                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">{lang === 'vi' ? 'Ngày Check-out' : 'Check-out'}</span>
                                    <span className="font-black text-ocean flex items-center gap-2 justify-end">
                                      {searchData.checkOut}
                                      <Calendar size={14} className="text-gold" />
                                    </span>
                                  </div>
                               </div>
                             </div>

                             <div className="pt-4 text-center">
                               <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                 {lang === 'vi' ? '* Một nhân viên tư vấn sẽ gọi điện cho bạn sớm nhất có thể.' : '* A property advisor will call you as soon as possible.'}
                               </p>
                             </div>
                          </div>

                          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                              onClick={handleBookAnother} 
                              className="bg-ocean text-white px-10 py-5 rounded-2xl font-bold shadow-xl hover:bg-ocean/90 transition-all hover:-translate-y-1 active:translate-y-0 group flex items-center justify-center gap-3"
                            >
                               <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                               {lang === 'vi' ? 'Đăng ký phòng khác' : 'Book Another Room'}
                            </button>
                            <a 
                              href="#home" 
                              onClick={() => setShowBookingSection(false)}
                              className="bg-white text-ocean border-2 border-ocean/10 px-10 py-5 rounded-2xl font-bold hover:bg-slate-50 transition-all text-center flex items-center justify-center gap-3"
                            >
                               {lang === 'vi' ? 'Quay về trang chủ' : 'Return to Home'}
                            </a>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-ocean mb-4">{t.booking.submitRequest}</h2>
                            <p className="text-slate-600 max-w-lg mx-auto mb-6">{t.booking.responsePromise}</p>
                            {selectedRoom && (
                              <div className="inline-flex items-center gap-3 bg-white/50 border border-white px-6 py-2 rounded-full shadow-sm">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.booking.youSelected}:</span>
                                <span className="text-sm font-bold text-ocean">
                                  {selectedRoom === '2br' ? t.roomFeatures.twoBrLabel : 
                                   ROOM_TYPES.find(r => r.id === selectedRoom)?.name}
                                 </span>
                               </div>
                             )}
                           </div>
    
                           <form id="bookingForm" onSubmit={handleBookingSubmit} className="space-y-6 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Row 1: Term & Full Name */}
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 block ml-1">{lang === 'vi' ? 'Kỳ hạn' : 'Term'}</label>
                                <select 
                                  name="term"
                                  required 
                                  value={searchData.type}
                                  onChange={(e) => setSearchData({...searchData, type: e.target.value})}
                                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 shadow-sm focus:ring-2 focus:ring-ocean/20 transition-all outline-none appearance-none"
                                >
                                  <option value={t.search.shortTermOpt}>{t.search.shortTermOpt.split(' (')[0]}</option>
                                  <option value={t.search.longTermOpt}>{t.search.longTermOpt.split(' (')[0]}</option>
                                </select>
                                <p className="text-[10px] font-bold text-ocean/60 mt-1.5 ml-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                                  <StickyNote size={10} />
                                  {searchData.type === t.search.shortTermOpt 
                                    ? (lang === 'vi' ? 'Dành cho kỳ hạn lưu trú dưới 28 đêm' : 'For stays under 28 nights')
                                    : (lang === 'vi' ? 'Dành cho kỳ hạn lưu trú từ 28 đêm trở lên' : 'For stays of 28 nights or more')
                                  }
                                </p>
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 block ml-1">{t.booking.fullName}</label>
                                <input 
                                  name="name"
                                  type="text" 
                                  required 
                                  placeholder={t.booking.fullNamePlaceholder}
                                  onChange={(e) => validateField('fullName', e.target.value)}
                                  className={`w-full bg-white border ${formErrors.fullName ? 'border-red-500' : 'border-slate-200'} rounded-2xl py-4 px-6 shadow-sm focus:ring-2 focus:ring-ocean/20 transition-all outline-none`} 
                                />
                                {formErrors.fullName && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1">{formErrors.fullName}</p>}
                              </div>

                              {/* Row 2: Phone & Email */}
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 block ml-1">{t.booking.phone}</label>
                                <input 
                                  name="phone"
                                  type="tel" 
                                  required 
                                  placeholder="096 409 0515"
                                  onChange={(e) => validateField('phone', e.target.value)}
                                  className={`w-full bg-white border ${formErrors.phone ? 'border-red-500' : 'border-slate-200'} rounded-2xl py-4 px-6 shadow-sm focus:ring-2 focus:ring-ocean/20 transition-all outline-none`} 
                                />
                                {formErrors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1">{formErrors.phone}</p>}
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 block ml-1">{t.booking.email}</label>
                                <input 
                                  name="email"
                                  type="email" 
                                  required 
                                  placeholder="email@example.com"
                                  onChange={(e) => validateField('email', e.target.value)}
                                  className={`w-full bg-white border ${formErrors.email ? 'border-red-500' : 'border-slate-200'} rounded-2xl py-4 px-6 shadow-sm focus:ring-2 focus:ring-ocean/20 transition-all outline-none`} 
                                />
                                {formErrors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1">{formErrors.email}</p>}
                              </div>

                              {/* Row 3: Adults & Children */}
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 block ml-1">{t.search.adultsLabel}</label>
                                <input 
                                  name="adults_count"
                                  type="number" 
                                  required 
                                  min="1"
                                  defaultValue={searchData.adults}
                                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 shadow-sm focus:ring-2 focus:ring-ocean/20 transition-all outline-none" 
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 block ml-1">{t.search.childrenLabel}</label>
                                <input 
                                  name="children_count"
                                  type="number" 
                                  required 
                                  min="0"
                                  defaultValue={searchData.children}
                                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 shadow-sm focus:ring-2 focus:ring-ocean/20 transition-all outline-none" 
                                />
                                <input type="hidden" name="quantity" value="" />
                              </div>

                              {/* Row 4: Dates selection (Full width) */}
                              <div className="md:col-span-2 space-y-2 relative">
                                <label className="text-sm font-bold text-slate-700 block ml-1">{lang === 'vi' ? 'Thời gian lưu trú' : 'Stay Duration'}</label>
                                <div 
                                  onClick={() => setShowBookingCalendar(!showBookingCalendar)}
                                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 shadow-sm focus-within:ring-2 focus-within:ring-ocean/20 transition-all outline-none cursor-pointer flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-4">
                                    <Calendar className="text-ocean" size={20} />
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-ocean">
                                        {searchData.checkIn || 'YYYY-MM-DD'}
                                      </span>
                                      <ArrowRight size={14} className="text-slate-300" />
                                      <span className="font-bold text-ocean">
                                        {searchData.checkOut || 'YYYY-MM-DD'}
                                      </span>
                                    </div>
                                  </div>
                                  {searchData.checkIn && searchData.checkOut && (
                                    <span className="bg-ocean text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-in zoom-in">
                                      {differenceInDays(parseISO(searchData.checkOut), parseISO(searchData.checkIn))} {t.search.nights}
                                    </span>
                                  )}
                                </div>

                                <input type="hidden" name="checkin" value={searchData.checkIn} />
                                <input type="hidden" name="checkout" value={searchData.checkOut} />

                                {/* Booking Calendar Popover */}
                                <AnimatePresence>
                                  {showBookingCalendar && (
                                    <>
                                      <div className="fixed inset-0 z-[1000]" onClick={() => setShowBookingCalendar(false)}></div>
                                      <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute bottom-full left-0 right-0 mb-4 z-[1001] flex justify-center"
                                      >
                                        <CustomCalendar 
                                          checkIn={searchData.checkIn}
                                          checkOut={searchData.checkOut}
                                          lang={lang}
                                          t={t}
                                          onRangeSelect={(range) => {
                                            setSearchData(prev => ({ ...prev, ...range }));
                                            if (range.checkIn && range.checkOut) {
                                              setShowBookingCalendar(false);
                                            }
                                          }}
                                        />
                                      </motion.div>
                                    </>
                                  )}
                                </AnimatePresence>
                              </div>

                              {/* Row 5: Price Display & Notes (Full width) */}
                              <div className="md:col-span-2 py-1">
                                <div className="bg-sand/30 border border-white rounded-[32px] p-6 shadow-inner space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                        {lang === 'vi' ? 'Giá dự kiến' : 'Estimated Price'}
                                      </span>
                                      <span className="text-xs text-slate-500 italic block">
                                        {searchData.type === t.search.longTermOpt 
                                          ? (lang === 'vi' ? 'Giá thuê theo tháng' : 'Monthly rent')
                                          : (lang === 'vi' ? 'Giá thuê theo đêm' : 'Nightly rate')
                                        }
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-3xl font-black text-ocean animate-in fade-in duration-300">
                                        {(() => {
                                          const room = ROOM_TYPES.find(r => r.id === selectedRoom);
                                          if (!room) return '---';
                                          return searchData.type === t.search.longTermOpt ? room.monthly : room.shortTerm;
                                        })()}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="pt-4 border-t border-white/50">
                                    <p className="text-[11px] leading-relaxed text-slate-600 font-medium italic">
                                      {searchData.type === t.search.longTermOpt ? (
                                        lang === 'vi' ? 
                                        '* Giá không bao gồm tiền điện theo mức sử dụng (4,000vnd/KWH) và tiền nước là 50,000vnd/người/tháng.' : 
                                        '* Price excludes electricity (4,000vnd/KWH) and water (50,000vnd/person/month) based on usage.'
                                      ) : (
                                        lang === 'vi' ? 
                                        '* Giá đã bao gồm tất cả chi phí (all-in). Khách được dọn dẹp hàng tuần và thay khăn tắm, khăn mặt.' : 
                                        '* All-in price including weekly cleaning and fresh towels replacement.'
                                      )}
                                    </p>
                                  </div>

                                  {/* Pets Checkbox inside price box */}
                                  <div className="pt-2">
                                     <button
                                       type="button"
                                       onClick={() => setSearchData({...searchData, pets: !searchData.pets})}
                                       className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${searchData.pets ? 'bg-ocean text-white border-ocean shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
                                     >
                                       <Dog size={16} />
                                       <span className="text-xs font-bold">{lang === 'vi' ? 'Tôi có mang theo thú cưng' : 'I am bringing pets'}</span>
                                       <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${searchData.pets ? 'bg-white border-white' : 'bg-transparent border-slate-200'}`}>
                                          {searchData.pets && <Check size={10} className="text-ocean" />}
                                       </div>
                                     </button>
                                     <input 
                                       type="checkbox" 
                                       name="pets" 
                                       checked={searchData.pets} 
                                       onChange={() => {}} 
                                       className="sr-only" 
                                     />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="pt-6">
                              <button 
                                type="submit" 
                                disabled={bookingStatus === 'loading'}
                                className="w-full bg-ocean text-white py-5 rounded-2xl font-bold text-lg hover:bg-ocean/90 transition-all shadow-xl shadow-teal-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
                              >
                                {bookingStatus === 'loading' ? (
                                  <Loader2 className="animate-spin" size={24} />
                                ) : (
                                  <>{lang === 'vi' ? 'Gửi yêu cầu đặt phòng' : 'Send Booking Request'} <ArrowRight size={20} /></>
                                )}
                              </button>
                            </div>
                          </form>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

        {/* Location Section */}
        <section id="location" className="py-16 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-ocean">{t.footer.locationTitle}</h2>
                  <p className="text-slate-500 font-light leading-relaxed">
                    {t.footer.locationSubtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 bg-aqua/30 rounded-3xl border border-white flex gap-4 items-start shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-ocean flex items-center justify-center text-white shrink-0">
                      <Palmtree size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{t.footer.points.beach}</p>
                      <p className="text-xs text-slate-500">{t.footer.points.beachDesc}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-aqua/30 rounded-3xl border border-white flex gap-4 items-start shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-ocean flex items-center justify-center text-white shrink-0">
                      <UtensilsCrossed size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{t.footer.points.restaurant}</p>
                      <p className="text-xs text-slate-500">{t.footer.points.restaurantDesc}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-aqua/30 rounded-3xl border border-white flex gap-4 items-start shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-ocean flex items-center justify-center text-white shrink-0">
                      <Car size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{t.footer.points.airport}</p>
                      <p className="text-xs text-slate-500">{t.footer.points.airportDesc}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-aqua/30 rounded-3xl border border-white flex gap-4 items-start shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-ocean flex items-center justify-center text-white shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{t.footer.points.dragonBridge}</p>
                      <p className="text-xs text-slate-500">{t.footer.points.dragonBridgeDesc}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <a 
                    href="https://maps.app.goo.gl/FSC1P5YPX8ta1sQx8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-ocean text-white px-8 py-4 rounded-2xl font-bold hover:bg-ocean/90 transition-all shadow-xl shadow-teal-900/20"
                  >
                    {t.footer.points.directions} <Compass size={18} />
                  </a>
                </div>
              </div>

              <div className="lg:w-1/2 w-full h-[500px] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white relative group">
                <iframe 
                  src="https://www.google.com/maps/d/embed?mid=13RcHrAY0m4i3i5mE6iz7iOMSiTzt_OM" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true}
                  loading="lazy"
                  className="rounded-3xl"
                  title="Ocena Apartment Map"
                ></iframe>
                {/* Overlay to allow scrolling the page over the map on mobile */}
                <div className="absolute inset-0 bg-transparent pointer-events-none group-hover:pointer-events-auto"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-ocean text-white pt-32 pb-12 relative overflow-hidden">
          {/* Subtle Footer Wave Animation */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          
          {/* Decorative Elements for Footer */}
          <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-10 rotate-180">
            <svg className="relative block w-[calc(100%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.83C51.17,113.84,126.19,123.9,202.68,113.84,263.5,105.75,285.58,71.25,321.39,56.44Z" fill="#EFE9E1"></path>
            </svg>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center" aria-hidden="true">
                    <OcenaLogo className="text-gold w-6 h-6" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-tighter leading-none">OCENA</span>
                    <span className="text-[9px] font-bold tracking-[0.2em] text-gold uppercase mt-0.5">Apartment</span>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  {t.footer.description}
                </p>
                <div className="flex space-x-4">
                  <a href="https://www.facebook.com/ocena43/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                    <Facebook size={20} aria-hidden="true" />
                  </a>
                  <a href="https://www.instagram.com/ocenaliving/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                    <Instagram size={20} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-lg font-bold">{t.footer.contact}</h4>
                <ul className="space-y-4">
                  <li>
                    <a 
                      href="https://maps.app.goo.gl/FSC1P5YPX8ta1sQx8" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 text-white/70 text-sm hover:text-white transition-all group"
                      aria-label="View address on Google Maps"
                    >
                      <MapPin size={18} className="flex-shrink-0 text-white/40 group-hover:text-gold transition-colors" />
                      <span>{t.footer.address}</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="tel:+84964090515" 
                      className="flex items-center gap-3 text-white/70 text-sm hover:text-white transition-all group"
                      aria-label="Call +84 964 090 515"
                    >
                      <Phone size={18} className="flex-shrink-0 text-white/40 group-hover:text-gold transition-colors" />
                      <span>+84 964 090 515</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="mailto:booking@ocenaliving.com" 
                      className="flex items-center gap-3 text-white/70 text-sm hover:text-white transition-all group"
                      aria-label="Email booking@ocenaliving.com"
                    >
                      <Mail size={18} className="flex-shrink-0 text-white/40 group-hover:text-gold transition-colors" />
                      <span>booking@ocenaliving.com</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-lg font-bold">{t.footer.quickLinks}</h4>
                <ul className="space-y-3">
                  {[t.footer.links.about, t.footer.links.privacy, t.footer.links.terms, t.footer.links.faq].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/60 text-sm hover:text-white transition-all">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div className="border-t border-white/10 pt-10 text-center text-white/40 text-xs">
              <p>{t.footer.rights}</p>
            </div>
          </div>
        </footer>
      </main>

      {/* Room Gallery Modal */}
      <AnimatePresence>
        {viewingGallery && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-title"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-5xl rounded-[40px] overflow-hidden relative max-h-[90vh] flex flex-col focus:outline-none"
              tabIndex={-1}
              autoFocus
            >
              <button 
                onClick={() => setViewingGallery(null)}
                className="absolute top-6 right-6 z-10 bg-black/10 hover:bg-black/20 p-2 rounded-full transition-all"
                aria-label="Close gallery"
              >
                <X size={24} aria-hidden="true" />
              </button>

              <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[500px]">
                <div className="md:w-2/3 bg-slate-900 relative flex items-center justify-center p-0 md:p-4 min-h-[350px]">
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.img 
                        key={`${viewingGallery.id}-${currentImageIndex}`}
                        src={viewingGallery.gallery[currentImageIndex]} 
                        alt={`${viewingGallery.title || viewingGallery.name} - Image ${currentImageIndex + 1} of ${viewingGallery.gallery.length}`} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-full max-h-full object-contain cursor-default"
                      />
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-20"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} aria-hidden="true" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-20"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} aria-hidden="true" />
                    </button>

                    {/* Progress Dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                      {viewingGallery.gallery.map((_: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          aria-label={`Go to image ${idx + 1}`}
                          className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/40'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3 p-8 bg-sand/50 flex flex-col overflow-y-auto">
                  <h3 id="gallery-title" className="text-3xl font-bold text-ocean mb-4">{viewingGallery.name || viewingGallery.title}</h3>
                  <p className="text-slate-600 mb-8">{viewingGallery.description}</p>
                  
                  <div className="space-y-8 mb-8">
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <Maximize2 size={16} /> {t.gallery.highlights}
                      </h4>
                      <ul className="grid grid-cols-1 gap-3">
                        {viewingGallery.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 text-slate-700 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-ocean"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {!viewingGallery.isCommonSpace && viewingGallery.included && (
                      <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                          <PackageCheck size={16} /> {t.gallery.whatsIncluded}
                        </h4>
                        <ul className="grid grid-cols-1 gap-3">
                          {viewingGallery.included.map((item: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 text-slate-700 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!viewingGallery.isCommonSpace && viewingGallery.rules && (
                      <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                          <StickyNote size={16} /> {t.gallery.houseRules}
                        </h4>
                        <ul className="grid grid-cols-1 gap-3">
                          {viewingGallery.rules.map((rule: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-600 text-sm italic">
                              <span className="text-ocean">•</span>
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-8 border-t border-slate-200">
                    {!viewingGallery.isCommonSpace && (
                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t.gallery.priceFrom}</p>
                          <p className="text-2xl font-bold text-ocean">{viewingGallery.shortTerm}</p>
                        </div>
                        <p className="text-sm text-slate-500">{t.gallery.perNight}</p>
                      </div>
                    )}
                    
                    {!viewingGallery.isCommonSpace ? (
                      <button 
                        onClick={() => {
                          handleSelectRoom(viewingGallery.name);
                          setViewingGallery(null);
                        }}
                        className="w-full bg-ocean text-white py-4 rounded-2xl font-bold hover:bg-ocean/90 transition-all flex items-center justify-center gap-2"
                      >
                        {t.gallery.bookThis} <ArrowRight size={18} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => setViewingGallery(null)}
                        className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                      >
                        Close Gallery
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

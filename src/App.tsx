
import { useState, useRef, FormEvent, useEffect } from 'react';
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
  Layout,
  WashingMachine,
  Refrigerator,
  ArrowUpCircle
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { translations, Language } from './lib/translations';

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
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bookingErrorMessage, setBookingErrorMessage] = useState<string | null>(null);
  const [bookingFormData, setBookingFormData] = useState({
    fullName: '',
    phone: '',
    email: ''
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

  const AMENITIES = [
    { icon: 'Wifi', name: t.amenities.list.wifi, desc: t.amenities.list.wifiDesc },
    { icon: 'Waves', name: t.amenities.list.oceanAir, desc: t.amenities.list.oceanAirDesc },
    { icon: 'UtensilsCrossed', name: t.amenities.list.kitchen, desc: t.amenities.list.kitchenDesc },
    { icon: 'Tv', name: t.amenities.list.tv, desc: t.amenities.list.tvDesc },
    { icon: 'Wind', name: t.amenities.list.ac, desc: t.amenities.list.acDesc },
    { icon: 'Layout', name: t.amenities.list.coworking, desc: t.amenities.list.coworkingDesc },
    { icon: 'ShieldCheck', name: t.amenities.list.security, desc: t.amenities.list.securityDesc },
    { icon: 'Coffee', name: t.amenities.list.balcony, desc: t.amenities.list.balconyDesc },
    { icon: 'WashingMachine', name: t.amenities.list.laundry, desc: t.amenities.list.laundryDesc },
    { icon: 'Refrigerator', name: t.amenities.list.fridge, desc: t.amenities.list.fridgeDesc },
    { icon: 'Car', name: t.amenities.list.parking, desc: t.amenities.list.parkingDesc },
    { icon: 'ArrowUpCircle', name: t.amenities.list.elevator, desc: t.amenities.list.elevatorDesc },
  ];

  const ROOM_TYPES = [
    {
      id: 'rest-studio',
      name: 'Rest Studio',
      shortTerm: '450.000đ',
      monthly: '8.000.000đ',
      image: 'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931592/Rest-apartment-Studio-Ocena-Mykhe-Danang-43_rq4t8a.jpg?auto=format&fit=crop&q=80&w=800',
      gallery: [
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931592/Rest-apartment-Studio-Ocena-Mykhe-Danang-43_rq4t8a.jpg?auto=format&fit=crop&q=80&w=800',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931592/Rest-apartment-Studio-Ocena-Mykhe-Danang-44_uxiwe9.jpg?auto=format&fit=crop&q=80&w=800',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931594/Rest-apartment-Studio-Ocena-Mykhe-Danang-45_uttehc.jpg?auto=format&fit=crop&q=80&w=800',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931591/Rest-apartment-Studio-Ocena-Mykhe-Danang-42_ypqy5y.jpg?auto=format&fit=crop&q=80&w=800',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931595/Rest-apartment-Studio-Ocena-Mykhe-Danang-46_gir4mv.jpg?auto=format&fit=crop&q=80&w=800'
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
      image: 'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931567/Gargen-view-Studio-Ocena-Mykhe-Danang-14_noy0el.jpg?auto=format&fit=crop&q=80&w=800',
      gallery: [
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931566/Gargen-view-Studio-Ocena-Mykhe-Danang-11_pff6z6.jpg?auto=format&fit=crop&q=80&w=800',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931569/Gargen-view-Studio-Ocena-Mykhe-Danang-26_txsqdz.jpg?auto=format&fit=crop&q=80&w=800',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931567/Gargen-view-Studio-Ocena-Mykhe-Danang-15_a12qea.jpg?auto=format&fit=crop&q=80&w=800',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931571/Gargen-view-Studio-Ocena-Mykhe-Danang-30_xsi4jp.jpg?auto=format&fit=crop&q=80&w=800',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931568/Gargen-view-Studio-Ocena-Mykhe-Danang-16_ukxr3z.jpg?auto=format&fit=crop&q=80&w=800'
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
      image: 'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931576/Seaside-view-Studio-Ocena-Mykhe-Danang-17_qpbjve.jpg?auto=format&fit=crop&q=80&w=800',
      gallery: [
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931577/Seaside-view-Studio-Ocena-Mykhe-Danang-18_k114jm.jpg?auto=format&fit=crop&q=80&w=800',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931579/Seaside-view-Studio-Ocena-Mykhe-Danang-21_qjuwym.jpg?auto=format&fit=crop&q=80&w=800',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931580/Seaside-view-Studio-Ocena-Mykhe-Danang-23_afyeet.jpg?auto=format&fit=crop&q=80&w=800',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931580/Seaside-view-Studio-Ocena-Mykhe-Danang-22_jzcriv.jpg?auto=format&fit=crop&q=80&w=800',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931581/Seaside-view-Studio-Ocena-Mykhe-Danang-24_ehinzb.jpg?auto=format&fit=crop&q=80&w=800'
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
      image: 'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931553/2BR-apartment-Ocena-Mykhe-Danang-2_v5ysde.jpg?auto=format&fit=crop&q=80&w=800',
      gallery: [
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931552/2BR-apartment-Ocena-Mykhe-Danang-1_b7lxi1.jpg?auto=format&fit=crop&q=80&w=800',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931555/2BR-apartment-Ocena-Mykhe-Danang-6_pdoffl.jpg?auto=format&fit=crop&q=80&w=800',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931557/2BR-apartment-Ocena-Mykhe-Danang-39_elbrcp.jpg?auto=format&fit=crop&q=80&w=800',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931555/2BR-apartment-Ocena-Mykhe-Danang-7_qmogwv.jpg?auto=format&fit=crop&q=80&w=800',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931556/2BR-apartment-Ocena-Mykhe-Danang-8_utzvoc.jpg?auto=format&fit=crop&q=80&w=800'
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
      image: 'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931546/Rent-apartment-Studio-Ocena-Mykhe-Danang-83_w0u1lk.jpg?auto=format&fit=crop&q=80&w=1200',
      description: t.commonSpaces.lobbyDesc,
      gallery: [
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931544/Rent-apartment-Studio-Ocena-Mykhe-Danang-77_xidlha.jpg?auto=format&fit=crop&q=80&w=1200',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931546/Rent-apartment-Studio-Ocena-Mykhe-Danang-83_w0u1lk.jpg?auto=format&fit=crop&q=80&w=1200',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931545/Rent-apartment-Studio-Ocena-Mykhe-Danang-78_p4y4dc.jpg?auto=format&fit=crop&q=80&w=1200'
      ],
      features: ['Modern Lobby', 'Multi-purpose', 'Social Space'],
      isCommonSpace: true
    },
    {
      id: 'surroundings',
      title: t.commonSpaces.surroundings,
      image: 'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931549/Rent-apartment-Studio-Ocena-Mykhe-Danang-88_wmasgh.jpg?auto=format&fit=crop&q=80&w=1200',
      description: t.commonSpaces.surroundingsDesc,
      gallery: [
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931545/Rent-apartment-Studio-Ocena-Mykhe-Danang-79_ysjmwb.jpg?auto=format&fit=crop&q=80&w=1200',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931549/Rent-apartment-Studio-Ocena-Mykhe-Danang-89_rjlmir.jpg?auto=format&fit=crop&q=80&w=1200',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931546/Rent-apartment-Studio-Ocena-Mykhe-Danang-82_huifnk.jpg?auto=format&fit=crop&q=80&w=1200'
      ],
      features: ['Quiet Area', 'Tropical Greenery', 'Sea Breeze'],
      isCommonSpace: true
    },
    {
      id: 'balcony',
      title: t.commonSpaces.oceanBalcony,
      image: 'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931543/Rent-apartment-Studio-Ocena-Mykhe-Danang-73_hxvszj.jpg?auto=format&fit=crop&q=80&w=1200',
      description: t.commonSpaces.oceanBalconyDesc,
      gallery: [
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931538/Rent-apartment-Studio-Ocena-Mykhe-Danang-31_ir2h5x.jpg?auto=format&fit=crop&q=80&w=1200',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931541/Rent-apartment-Studio-Ocena-Mykhe-Danang-67_nikvju.jpg?auto=format&fit=crop&q=80&w=1200',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931543/Rent-apartment-Studio-Ocena-Mykhe-Danang-73_hxvszj.jpg?auto=format&fit=crop&q=80&w=1200'
      ],
      features: ['Ocean View', 'Outdoor Work', 'Relaxing Spot'],
      isCommonSpace: true
    },
    {
      id: 'rooftop',
      title: t.commonSpaces.rooftop,
      image: 'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931542/Rent-apartment-Studio-Ocena-Mykhe-Danang-69_mkgado.jpg?auto=format&fit=crop&q=80&w=1200',
      description: t.commonSpaces.rooftopDesc,
      gallery: [
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931543/Rent-apartment-Studio-Ocena-Mykhe-Danang-70_zqv0k4.jpg?auto=format&fit=crop&q=80&w=1200',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931542/Rent-apartment-Studio-Ocena-Mykhe-Danang-68_ikq1up.jpg?auto=format&fit=crop&q=80&w=1200',
        'https://res.cloudinary.com/dap0pojyl/image/upload/v1774931539/Rent-apartment-Studio-Ocena-Mykhe-Danang-37_ujy2cp.jpg?auto=format&fit=crop&q=80&w=1200'
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

  const handleSelectRoom = (roomName: string) => {
    setSelectedRoom(roomName);
    setBookingStep(1);
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
    
    // Validate all fields
    const isEmailValid = validateField('email', bookingFormData.email);
    const isPhoneValid = validateField('phone', bookingFormData.phone);
    const isNameValid = validateField('fullName', bookingFormData.fullName);

    if (!isEmailValid || !isPhoneValid || !isNameValid) return;

    setBookingStatus('loading');
    setBookingErrorMessage(null);

    const selectedRoomData = ROOM_TYPES.find(r => r.name === selectedRoom);

    try {
      const response = await fetch('/api/booking-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingFormData,
          roomType: selectedRoom,
          ...searchData,
          lang,
          houseRules: selectedRoomData?.rules || []
        }),
      });

      if (response.ok) {
        setBookingStatus('success');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error:', errorData);
        setBookingStatus('error');
        setBookingErrorMessage(errorData.details || errorData.error || 'Server error');
      }
    } catch (error) {
      console.error('Network or client error:', error);
      setBookingStatus('error');
      setBookingErrorMessage('Network error');
    }
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
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/20" aria-hidden="true">
                <Waves className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-ocean">OCENA APARTMENT</span>
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

      <main className="pt-20 relative overflow-hidden" role="main">
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
        <section id="home" ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden py-32">
          <div className="absolute inset-0 z-0">
            <motion.img 
              style={{ y: backgroundY }}
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600" 
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
              className="w-[95%] md:w-full max-w-6xl px-4"
            >
              <div className="bg-white/95 backdrop-blur-xl p-2 md:p-3 rounded-[32px] md:rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50">
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
                  </div>

                  {/* Dates Component (Balanced) */}
                  <div className="flex-[1.5] flex flex-col md:flex-row items-center">
                    <div className="flex-1 w-full p-3 md:px-8 text-left hover:bg-slate-50 transition-all rounded-3xl md:rounded-full cursor-pointer relative group">
                      <label htmlFor="search-check-in" className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{t.search.checkIn}</label>
                      <input 
                        id="search-check-in"
                        type="date" 
                        value={searchData.checkIn}
                        onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                        className="w-full bg-transparent border-none p-0 text-sm font-semibold focus:ring-0 cursor-pointer" 
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-ocean transition-colors" size={16} />
                    </div>

                    <div className="flex items-center justify-center -mx-2 z-10 hidden md:flex">
                      <div className="w-7 h-7 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300">
                        <ArrowRight size={12} />
                      </div>
                    </div>

                    <div className="flex-1 w-full p-3 md:px-8 text-left hover:bg-slate-50 transition-all rounded-3xl md:rounded-full cursor-pointer relative group">
                      <label htmlFor="search-check-out" className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{t.search.checkOut}</label>
                      <input 
                        id="search-check-out"
                        type="date" 
                        value={searchData.checkOut}
                        onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                        className="w-full bg-transparent border-none p-0 text-sm font-semibold focus:ring-0 cursor-pointer" 
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-ocean transition-colors" size={16} />
                    </div>
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
        <section className="py-24 bg-white relative overflow-hidden">
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
                  onClick={() => setViewingGallery(space)}
                  role="listitem"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setViewingGallery(space); }}
                  aria-label={`View gallery for ${space.title}`}
                >
                  {/* Photo Stack Effect */}
                  <div className="absolute inset-0 w-full h-full">
                    <img 
                      src={space.image} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
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
        <section className="py-24 bg-aqua/30 relative">
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
        <section id="rooms" ref={roomsRef} className="py-32 bg-transparent">
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
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                      <button 
                        onClick={() => setViewingGallery(room)}
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

                    <button 
                      onClick={() => handleSelectRoom(room.name)}
                      aria-label={`${t.rooms.selectRoom} - ${room.name}`}
                      className="w-full py-4 rounded-2xl bg-ocean text-white font-bold hover:bg-ocean/90 transition-all text-sm shadow-lg shadow-teal-900/10 active:scale-[0.98]"
                    >
                      {t.rooms.selectRoom}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Amenities Section */}
        <section id="amenities" className="py-24 bg-transparent relative overflow-hidden">
          {/* Decorative Leaf for Amenities */}
          <div className="absolute top-0 right-0 w-96 h-96 text-ocean/5 -mr-20 -mt-20 rotate-45 pointer-events-none">
            <svg viewBox="0 0 200 200" fill="currentColor">
              <path d="M100 20 C 120 40 130 70 100 100 C 70 70 80 40 100 20 M100 100 C 120 120 130 150 100 180 C 70 150 80 120 100 100" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-80 h-80 text-ocean/5 -ml-20 -mb-20 -rotate-12 pointer-events-none">
            <svg viewBox="0 0 200 200" fill="currentColor">
              <path d="M100 20 C 120 40 130 70 100 100 C 70 70 80 40 100 20 M100 100 C 120 120 130 150 100 180 C 70 150 80 120 100 100" />
            </svg>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full text-ocean/5 opacity-10 pointer-events-none">
            <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
              <path d="M100 20 C 120 40 130 70 100 100 C 70 70 80 40 100 20 M100 100 C 120 120 130 150 100 180 C 70 150 80 120 100 100" />
            </svg>
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-ocean/10 to-transparent animate-pulse"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold text-ocean mb-6">{t.amenities.title}</h2>
                <p className="text-slate-500 mb-10 leading-relaxed">
                  {t.amenities.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8">
                  {AMENITIES.map((amenity) => {
                    const Icon = {
                      Wifi, Waves, UtensilsCrossed, Tv, Wind, Layout, ShieldCheck, Coffee, 
                      WashingMachine, Refrigerator, Car, ArrowUpCircle
                    }[amenity.icon] as any;
                    
                    return (
                      <div key={amenity.name} className="flex items-start gap-5 group">
                        <div className="w-16 h-16 shrink-0 rounded-[24px] bg-aqua flex items-center justify-center text-ocean group-hover:bg-ocean group-hover:text-white transition-all duration-500 border border-white shadow-sm" aria-hidden="true">
                          <Icon size={32} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-800 text-lg group-hover:text-ocean transition-colors">{amenity.name}</h4>
                          <p className="text-sm text-slate-500 leading-relaxed font-light">{amenity.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex-1 relative">
                <div className="grid grid-cols-2 gap-4">
                  <img 
                    src="https://res.cloudinary.com/dap0pojyl/image/upload/v1777300965/1-41_q9mwf1.webp?auto=format&fit=crop&q=80&w=600" 
                    alt="Pool" 
                    className="rounded-3xl h-64 w-full object-cover mt-8"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <img 
                    src="https://res.cloudinary.com/dap0pojyl/image/upload/v1777300965/Air_Flow_Sys_qmxeo6.webp?auto=format&fit=crop&q=80&w=600" 
                    alt="Kitchen" 
                    className="rounded-3xl h-64 w-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-10 -right-10 bg-gold text-white p-10 rounded-[40px] shadow-2xl hidden md:block">
                  <p className="text-3xl font-bold mb-2">{t.amenities.featureTitle}</p>
                  <p className="text-3xs uppercase tracking-[0.3em] font-bold opacity-80">{t.amenities.featureSubtitle}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Amenities Grid */}
        <section className="py-24 bg-slate-50 relative overflow-hidden">
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
                <div className="bg-sand p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 text-ocean/5 -mr-20 -mt-20 rotate-45 pointer-events-none">
                    <svg viewBox="0 0 200 200" fill="currentColor">
                      <path d="M100 20 C 120 40 130 70 100 100 C 70 70 80 40 100 20 M100 100 C 120 120 130 150 100 180 C 70 150 80 120 100 100" />
                    </svg>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl md:text-4xl font-bold text-ocean mb-4">{t.booking.submitRequest}</h2>
                      <p className="text-slate-600 max-w-lg mx-auto">{t.booking.responsePromise}</p>
                    </div>

                    {!selectedRoom ? (
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-ocean mb-4">{t.booking.noRoomSelected}</h2>
                        <p className="text-slate-600 mb-8">{t.booking.selectToContinue}</p>
                        <button 
                          onClick={() => roomsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                          className="bg-ocean text-white px-8 py-3 rounded-xl font-bold"
                        >
                          {t.booking.viewRooms}
                        </button>
                      </div>
                    ) : bookingStep === 1 ? (
                      <div>
                        <div className="text-center mb-10">
                          <h2 className="text-3xl font-bold text-ocean mb-4">{t.booking.completeInfo}</h2>
                          <p className="text-slate-600">{t.booking.youSelected}: <span className="font-bold text-ocean">{selectedRoom}</span>. {t.booking.provideTime}</p>
                        </div>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); if (isSearchComplete) setBookingStep(2); }}>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t.booking.type}</label>
                            <select 
                              value={searchData.type}
                              onChange={(e) => setSearchData({...searchData, type: e.target.value})}
                              className="w-full bg-white border-none rounded-2xl py-4 px-6 shadow-sm focus:ring-2 focus:ring-ocean/20 transition-all appearance-none"
                            >
                              <option value={t.search.shortTermOpt}>{t.search.shortTermOpt}</option>
                              <option value={t.search.longTermOpt}>{t.search.longTermOpt}</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t.booking.roomType}</label>
                            <select 
                              value={selectedRoom || ''}
                              onChange={(e) => setSelectedRoom(e.target.value)}
                              className="w-full bg-white border-none rounded-2xl py-4 px-6 shadow-sm focus:ring-2 focus:ring-ocean/20 transition-all appearance-none"
                            >
                              {ROOM_TYPES.map(room => (
                                <option key={room.id} value={room.name}>{room.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t.search.checkIn}</label>
                            <input 
                              type="date" 
                              required
                              value={searchData.checkIn}
                              onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                              className="w-full bg-white border-none rounded-2xl py-4 px-6 shadow-sm focus:ring-2 focus:ring-ocean/20 transition-all" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t.search.checkOut}</label>
                            <input 
                              type="date" 
                              required
                              value={searchData.checkOut}
                              onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                              className="w-full bg-white border-none rounded-2xl py-4 px-6 shadow-sm focus:ring-2 focus:ring-ocean/20 transition-all" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t.booking.adults}</label>
                            <input 
                              type="number" 
                              required
                              min="1"
                              value={searchData.adults}
                              onChange={(e) => setSearchData({...searchData, adults: parseInt(e.target.value) || 0})}
                              className="w-full bg-white border-none rounded-2xl py-4 px-6 shadow-sm focus:ring-2 focus:ring-ocean/20 transition-all" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t.booking.children}</label>
                            <input 
                              type="number" 
                              min="0"
                              value={searchData.children}
                              onChange={(e) => setSearchData({...searchData, children: parseInt(e.target.value) || 0})}
                              className="w-full bg-white border-none rounded-2xl py-4 px-6 shadow-sm focus:ring-2 focus:ring-ocean/20 transition-all" 
                            />
                          </div>
                          <div className="md:col-span-2 flex items-center gap-3 bg-white/50 p-4 rounded-2xl border border-ocean/5 mt-2">
                            <input 
                              type="checkbox" 
                              id="pet-form" 
                              checked={searchData.pets}
                              onChange={(e) => setSearchData({...searchData, pets: e.target.checked})}
                              className="w-5 h-5 rounded border-slate-300 text-ocean focus:ring-ocean" 
                            />
                            <label htmlFor="pet-form" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Dog size={18} className="text-ocean" /> {t.booking.petCheckForm}
                            </label>
                          </div>
                          <div className="md:col-span-2 pt-4">
                            <button 
                              type="submit"
                              className={`w-full py-4 rounded-2xl font-bold transition-all ${isSearchComplete ? 'bg-ocean text-white hover:bg-ocean/90' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                            >
                              {t.booking.nextStep}
                            </button>
                            {!isSearchComplete && (
                              <p className="text-[10px] text-red-400 mt-2 text-center font-medium uppercase tracking-widest">
                                {t.booking.incompleteSearch}
                              </p>
                            )}
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div>
                        <div className="text-center mb-10">
                          <h2 className="text-3xl font-bold text-ocean mb-4">{t.booking.contactInfo}</h2>
                          <div className="bg-white/50 p-6 rounded-3xl inline-block text-left text-sm space-y-2 border border-ocean/10 shadow-sm w-full max-w-md mx-auto">
                            <p className="flex items-center gap-2"><span className="text-slate-400 w-24 flex-shrink-0">{t.booking.type}:</span> <span className="font-bold text-secondary">{searchData.type}</span></p>
                            <p className="flex items-center gap-2"><span className="text-slate-400 w-24 flex-shrink-0">{t.booking.roomType}:</span> <span className="font-bold text-ocean">{selectedRoom}</span></p>
                            <p className="flex items-center gap-2"><span className="text-slate-400 w-24 flex-shrink-0">{t.search.checkIn}:</span> <span className="font-bold">{searchData.checkIn}</span> <ArrowRight size={12} className="text-slate-300 mx-1" /> <span className="font-bold">{searchData.checkOut}</span></p>
                            <p className="flex items-center gap-2"><span className="text-slate-400 w-24 flex-shrink-0">{t.search.guests}:</span> <span className="font-bold">{searchData.adults} {t.booking.adults}, {searchData.children} {t.booking.children}</span></p>
                            <p className="flex items-center gap-2 mb-4"><span className="text-slate-400 w-24 flex-shrink-0">{t.search.petCheck}:</span> <span className={`font-bold ${searchData.pets ? 'text-gold' : 'text-slate-400'}`}>{searchData.pets ? 'Yes' : 'No'}</span></p>
                            
                            {/* House Rules Section */}
                            <div className="pt-4 border-t border-ocean/10 mt-4">
                              <h3 className="text-[10px] font-bold text-ocean uppercase tracking-widest mb-3 flex items-center gap-2">
                                <StickyNote size={14} /> {t.gallery.houseRules}
                              </h3>
                              <ul className="space-y-1.5">
                                {ROOM_TYPES.find(r => r.name === selectedRoom)?.rules.map((rule, idx) => (
                                  <li key={idx} className="text-xs text-slate-500 italic flex items-start gap-2">
                                    <span className="text-ocean">•</span>
                                    {rule}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <form onSubmit={handleBookingSubmit} className="space-y-6" aria-label="Booking step 2: Contact Information">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label htmlFor="booking-full-name" className="text-sm font-bold text-slate-700 block ml-1">{t.booking.fullName}</label>
                              <input 
                                id="booking-full-name"
                                name="fullname"
                                type="text" 
                                autoComplete="name"
                                required 
                                aria-required="true"
                                value={bookingFormData.fullName}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setBookingFormData({...bookingFormData, fullName: val});
                                  if (formErrors.fullName) validateField('fullName', val);
                                }}
                                onBlur={(e) => validateField('fullName', e.target.value)}
                                className={`w-full bg-white border ${formErrors.fullName ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200'} rounded-2xl py-4 px-6 shadow-sm focus:ring-2 focus:ring-ocean/20 transition-all outline-none text-slate-700`} 
                                placeholder={t.booking.fullNamePlaceholder} 
                              />
                              {formErrors.fullName && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{formErrors.fullName}</p>}
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="booking-phone" className="text-sm font-bold text-slate-700 block ml-1">{t.booking.phone}</label>
                              <input 
                                id="booking-phone"
                                name="phone"
                                type="tel" 
                                autoComplete="tel"
                                required 
                                aria-required="true"
                                value={bookingFormData.phone}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setBookingFormData({...bookingFormData, phone: val});
                                  if (formErrors.phone) validateField('phone', val);
                                }}
                                onBlur={(e) => validateField('phone', e.target.value)}
                                className={`w-full bg-white border ${formErrors.phone ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200'} rounded-2xl py-4 px-6 shadow-sm focus:ring-2 focus:ring-ocean/20 transition-all outline-none text-slate-700`} 
                                placeholder="090 123 4567" 
                              />
                              {formErrors.phone && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{formErrors.phone}</p>}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="booking-email" className="text-sm font-bold text-slate-700 block ml-1">{t.booking.email}</label>
                            <input 
                              id="booking-email"
                              name="email"
                              type="email" 
                              autoComplete="email"
                              required 
                              aria-required="true"
                              value={bookingFormData.email}
                              onChange={(e) => {
                                const val = e.target.value;
                                setBookingFormData({...bookingFormData, email: val});
                                if (formErrors.email) validateField('email', val);
                              }}
                              onBlur={(e) => validateField('email', e.target.value)}
                              className={`w-full bg-white border ${formErrors.email ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200'} rounded-2xl py-4 px-6 shadow-sm focus:ring-2 focus:ring-ocean/20 transition-all outline-none text-slate-700`} 
                              placeholder="email@example.com" 
                            />
                            {formErrors.email && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{formErrors.email}</p>}
                          </div>
                          
                          {bookingStatus === 'success' ? (
                            <div className="space-y-6">
                              <div className="p-6 bg-green-50 text-green-700 rounded-3xl text-center font-medium border border-green-100">
                                <PackageCheck className="mx-auto mb-3 text-green-500" size={32} />
                                {t.booking.successMessage}
                              </div>
                              <button 
                                type="button"
                                onClick={() => {
                                  setBookingStatus('idle');
                                  setBookingStep(1);
                                  setSelectedRoom(null);
                                  roomsRef.current?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full bg-ocean text-white py-5 rounded-2xl font-bold text-lg hover:bg-ocean/90 transition-all shadow-xl shadow-teal-900/20 flex items-center justify-center gap-3"
                              >
                                {t.booking.bookAnother} <ArrowRight size={20} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <button 
                                type="submit" 
                                disabled={bookingStatus === 'loading'}
                                aria-busy={bookingStatus === 'loading'}
                                className="w-full bg-ocean text-white py-5 rounded-2xl font-bold text-lg hover:bg-ocean/90 transition-all shadow-xl shadow-teal-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
                              >
                                {bookingStatus === 'loading' ? (
                                  <Loader2 className="animate-spin" size={24} aria-hidden="true" />
                                ) : (
                                  <>{t.booking.submitBtn} <ChevronRight size={20} aria-hidden="true" /></>
                                )}
                              </button>
                              
                              {bookingStatus === 'error' && (
                                <div className="space-y-4 mt-6">
                                  <div className="p-4 bg-red-100 text-red-800 rounded-2xl text-center font-bold border-2 border-red-200">
                                    {t.booking.errorMessage}
                                  </div>
                                  <div className="p-4 border-2 border-dashed border-red-300 rounded-3xl bg-red-50/50 text-left">
                                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">{t.booking.errorCodeLabel}</p>
                                    <div className="text-xs text-red-600 font-mono break-all whitespace-pre-wrap">
                                      {bookingErrorMessage || 'Unknown Error'}
                                    </div>
                                  </div>
                                </div>
                              )}

                              <button 
                                type="button"
                                onClick={() => { setBookingStep(1); setBookingStatus('idle'); }}
                                className="w-full text-slate-400 text-sm hover:text-ocean transition-all mt-6"
                              >
                                {t.booking.backStep}
                              </button>
                            </>
                          )}
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Location Section */}
        <section id="location" className="py-24 bg-white relative">
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
                <span className="text-2xl font-bold tracking-tighter">{t.hero.title.toUpperCase()}</span>
                <p className="text-white/60 text-sm leading-relaxed">
                  {t.footer.description}
                </p>
                <div className="flex space-x-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                    <Facebook size={20} aria-hidden="true" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                    <Instagram size={20} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-lg font-bold">{t.footer.contact}</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-white/70 text-sm">
                    <MapPin size={18} className="flex-shrink-0 text-white/40" />
                    <span>{t.footer.address}</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/70 text-sm">
                    <Phone size={18} className="flex-shrink-0 text-white/40" />
                    <span>+84 901 234 567</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/70 text-sm">
                    <Mail size={18} className="flex-shrink-0 text-white/40" />
                    <span>contact@ocena.vn</span>
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

              <div className="flex flex-col md:flex-row h-full overflow-hidden">
                <div className="md:w-2/3 bg-slate-900 relative flex items-center justify-center p-0 md:p-8">
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    <AnimatePresence initial={false}>
                      <motion.img 
                        key={currentImageIndex}
                        src={viewingGallery.gallery[currentImageIndex]} 
                        alt={`${viewingGallery.title || viewingGallery.name} - Image ${currentImageIndex + 1} of ${viewingGallery.gallery.length}`} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(_, info) => {
                          if (info.offset.x < -50) nextImage();
                          if (info.offset.x > 50) prevImage();
                        }}
                        className="absolute inset-0 w-full h-full object-contain cursor-grab active:cursor-grabbing"
                        referrerPolicy="no-referrer"
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

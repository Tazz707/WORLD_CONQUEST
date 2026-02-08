document.addEventListener('DOMContentLoaded', function() {
            // إدارة بيانات اللعبة
            const GameManager = {
                players: {},
                worldCapitals: [],
                selectedCountry: null,
                currentContinent: 'all',
                searchQuery: '',
                
                init: function() {
                    this.loadPlayers();
                    this.loadAllWorldCapitals();
                    this.updateStats();
                    this.renderContinentTabs();
                    this.renderCountries();
                    this.setupEventListeners();
                    this.hideLoading();
                },
                
                loadPlayers: function() {
                    try {
                        const savedPlayers = localStorage.getItem('worldStrategyPlayers');
                        if (savedPlayers) {
                            this.players = JSON.parse(savedPlayers);
                            console.log('تم تحميل اللاعبين:', Object.keys(this.players).length);
                        } else {
                            this.players = {};
                        }
                    } catch (error) {
                        console.error('خطأ في تحميل بيانات اللاعبين:', error);
                        this.players = {};
                    }
                },
                
                loadAllWorldCapitals: function() {
                    this.worldCapitals = [
                        // آسيا (50 دولة/منطقة)
                        { name: "كابول", country: "أفغانستان", countryCode: "af", continent: "آسيا", lat: 34.5553, lng: 69.2075, population: "38.9 مليون", economyPower: 25, militaryPower: 45, resources: "حديد، نحاس، خشب", status: "غير مستقر", owner: null },
                        { name: "يريفان", country: "أرمينيا", countryCode: "am", continent: "آسيا", lat: 40.1792, lng: 44.4991, population: "3.0 مليون", economyPower: 40, militaryPower: 35, resources: "نحاس، رصاص، خشب", status: "مستقرة", owner: null },
                        { name: "باكو", country: "أذربيجان", countryCode: "az", continent: "آسيا", lat: 40.4093, lng: 49.8671, population: "10.1 مليون", economyPower: 65, militaryPower: 55, resources: "نفط، غاز، حديد", status: "مستقرة", owner: null },
                        { name: "المنامة", country: "البحرين", countryCode: "bh", continent: "آسيا", lat: 26.2235, lng: 50.5876, population: "1.5 مليون", economyPower: 75, militaryPower: 30, resources: "نفط، غاز، خرسانة", status: "مستقرة", owner: null },
                        { name: "دكا", country: "بنغلاديش", countryCode: "bd", continent: "آسيا", lat: 23.8103, lng: 90.4125, population: "169.4 مليون", economyPower: 45, militaryPower: 40, resources: "زراعة، خشب، خرسانة", status: "مستقرة", owner: null },
                        { name: "تيمفو", country: "بوتان", countryCode: "bt", continent: "آسيا", lat: 27.4728, lng: 89.6390, population: "0.8 مليون", economyPower: 35, militaryPower: 15, resources: "خشب، خرسانة", status: "مستقرة", owner: null },
                        { name: "بندر سري بكاوان", country: "بروناي", countryCode: "bn", continent: "آسيا", lat: 4.9031, lng: 114.9398, population: "0.4 مليون", economyPower: 80, militaryPower: 25, resources: "نفط، غاز، خشب", status: "مستقرة", owner: null },
                        { name: "بنوم بنه", country: "كمبوديا", countryCode: "kh", continent: "آسيا", lat: 11.5564, lng: 104.9282, population: "16.7 مليون", economyPower: 40, militaryPower: 30, resources: "زراعة، سياحة، خشب", status: "مستقرة", owner: null },
                        { name: "بكين", country: "الصين", countryCode: "cn", continent: "آسيا", lat: 39.9042, lng: 116.4074, population: "1,439 مليون", economyPower: 90, militaryPower: 95, resources: "فحم، حديد، ألمنيوم، سيليكون", status: "قوية", owner: null },
                        { name: "نيقوسيا", country: "قبرص", countryCode: "cy", continent: "آسيا", lat: 35.1856, lng: 33.3823, population: "1.2 مليون", economyPower: 70, militaryPower: 25, resources: "سياحة، نحاس، خرسانة", status: "مستقرة", owner: null },
                        { name: "تبليسي", country: "جورجيا", countryCode: "ge", continent: "آسيا", lat: 41.7151, lng: 44.8271, population: "3.7 مليون", economyPower: 50, militaryPower: 35, resources: "زراعة، منغنيز، خشب", status: "مستقرة", owner: null },
                        { name: "نيودلهي", country: "الهند", countryCode: "in", continent: "آسيا", lat: 28.6139, lng: 77.2090, population: "1,428 مليون", economyPower: 75, militaryPower: 85, resources: "فحم، حديد، يورانيوم، خشب", status: "قوية", owner: null },
                        { name: "جاكرتا", country: "إندونيسيا", countryCode: "id", continent: "آسيا", lat: -6.2088, lng: 106.8456, population: "276.4 مليون", economyPower: 60, militaryPower: 65, resources: "نفط، غاز، قصدير، مطاط", status: "مستقرة", owner: null },
                        { name: "طهران", country: "إيران", countryCode: "ir", continent: "آسيا", lat: 35.6892, lng: 51.3890, population: "87.9 مليون", economyPower: 55, militaryPower: 75, resources: "نفط، غاز، نحاس، خرسانة", status: "قوية", owner: null },
                        { name: "بغداد", country: "العراق", countryCode: "iq", continent: "آسيا", lat: 33.3152, lng: 44.3661, population: "43.5 مليون", economyPower: 50, militaryPower: 50, resources: "نفط، غاز، فوسفات، خرسانة", status: "غير مستقر", owner: null },
                        { name: "القدس", country: "إسرائيل", countryCode: "il", continent: "آسيا", lat: 31.7683, lng: 35.2137, population: "9.4 مليون", economyPower: 80, militaryPower: 80, resources: "سيليكون، فوسفات، خرسانة", status: "قوية", owner: null },
                        { name: "طوكيو", country: "اليابان", countryCode: "jp", continent: "آسيا", lat: 35.6762, lng: 139.6503, population: "125.7 مليون", economyPower: 85, militaryPower: 85, resources: "سيليكون، فولاذ، خرسانة", status: "قوية", owner: null },
                        { name: "عمّان", country: "الأردن", countryCode: "jo", continent: "آسيا", lat: 31.9539, lng: 35.9106, population: "11.1 مليون", economyPower: 55, militaryPower: 40, resources: "فوسفات، سياحة، خرسانة", status: "مستقرة", owner: null },
                        { name: "أستانا", country: "كازاخستان", countryCode: "kz", continent: "آسيا", lat: 51.1694, lng: 71.4491, population: "19.0 مليون", economyPower: 60, militaryPower: 45, resources: "نفط، يورانيوم، كروم، خرسانة", status: "مستقرة", owner: null },
                        { name: "الكويت", country: "الكويت", countryCode: "kw", continent: "آسيا", lat: 29.3759, lng: 47.9774, population: "4.3 مليون", economyPower: 75, militaryPower: 35, resources: "نفط، غاز، خرسانة", status: "مستقرة", owner: null },
                        { name: "بشكيك", country: "قرغيزستان", countryCode: "kg", continent: "آسيا", lat: 42.8746, lng: 74.5698, population: "6.7 مليون", economyPower: 40, militaryPower: 20, resources: "ذهب، زئبق، خشب", status: "مستقرة", owner: null },
                        { name: "فيينتيان", country: "لاوس", countryCode: "la", continent: "آسيا", lat: 17.9757, lng: 102.6331, population: "7.5 مليون", economyPower: 35, militaryPower: 25, resources: "خشب، قصدير، خرسانة", status: "مستقرة", owner: null },
                        { name: "بيروت", country: "لبنان", countryCode: "lb", continent: "آسيا", lat: 33.8938, lng: 35.5018, population: "6.8 مليون", economyPower: 45, militaryPower: 30, resources: "سياحة، خرسانة", status: "غير مستقر", owner: null },
                        { name: "كوالالمبور", country: "ماليزيا", countryCode: "my", continent: "آسيا", lat: 3.1390, lng: 101.6869, population: "33.6 مليون", economyPower: 70, militaryPower: 50, resources: "نفط، قصدير، مطاط، خشب", status: "مستقرة", owner: null },
                        { name: "ماليه", country: "المالديف", countryCode: "mv", continent: "آسيا", lat: 4.1755, lng: 73.5093, population: "0.5 مليون", economyPower: 65, militaryPower: 10, resources: "سياحة، خرسانة", status: "مستقرة", owner: null },
                        { name: "أولان باتور", country: "منغوليا", countryCode: "mn", continent: "آسيا", lat: 47.8864, lng: 106.9057, population: "3.3 مليون", economyPower: 45, militaryPower: 20, resources: "فحم، نحاس، خشب", status: "مستقرة", owner: null },
                        { name: "نايبيداو", country: "ميانمار", countryCode: "mm", continent: "آسيا", lat: 19.7633, lng: 96.0785, population: "54.8 مليون", economyPower: 40, militaryPower: 45, resources: "غاز، أحجار كريمة، خشب", status: "غير مستقر", owner: null },
                        { name: "كاتماندو", country: "نيبال", countryCode: "np", continent: "آسيا", lat: 27.7172, lng: 85.3240, population: "30.5 مليون", economyPower: 35, militaryPower: 25, resources: "سياحة، خشب، خرسانة", status: "مستقرة", owner: null },
                        { name: "بيونغ يانغ", country: "كوريا الشمالية", countryCode: "kp", continent: "آسيا", lat: 39.0392, lng: 125.7625, population: "25.9 مليون", economyPower: 20, militaryPower: 70, resources: "فحم، حديد، رصاص، خرسانة", status: "معزولة", owner: null },
                        { name: "مسقط", country: "عُمان", countryCode: "om", continent: "آسيا", lat: 23.5880, lng: 58.3829, population: "4.6 مليون", economyPower: 65, militaryPower: 40, resources: "نفط، غاز، نحاس، خرسانة", status: "مستقرة", owner: null },
                        { name: "إسلام أباد", country: "باكستان", countryCode: "pk", continent: "آسيا", lat: 33.6844, lng: 73.0479, population: "242.9 مليون", economyPower: 50, militaryPower: 65, resources: "زراعة، منسوجات، خشب", status: "مستقرة", owner: null },
                        { name: "القدس الشرقية", country: "فلسطين", countryCode: "ps", continent: "آسيا", lat: 31.7833, lng: 35.2167, population: "5.2 مليون", economyPower: 30, militaryPower: 5, resources: "زراعة، سياحة، خرسانة", status: "محتلة", owner: null },
                        { name: "مانيلا", country: "الفلبين", countryCode: "ph", continent: "آسيا", lat: 14.5995, lng: 120.9842, population: "115.6 مليون", economyPower: 55, militaryPower: 40, resources: "نحاس، ذهب، خشب", status: "مستقرة", owner: null },
                        { name: "الدوحة", country: "قطر", countryCode: "qa", continent: "آسيا", lat: 25.2854, lng: 51.5310, population: "2.9 مليون", economyPower: 85, militaryPower: 35, resources: "غاز، نفط، خرسانة", status: "مستقرة", owner: null },
                        { name: "الرياض", country: "السعودية", countryCode: "sa", continent: "آسيا", lat: 24.7136, lng: 46.6753, population: "36.4 مليون", economyPower: 75, militaryPower: 75, resources: "نفط، غاز، ذهب، خرسانة", status: "قوية", owner: null },
                        { name: "سنغافورة", country: "سنغافورة", countryCode: "sg", continent: "آسيا", lat: 1.3521, lng: 103.8198, population: "5.9 مليون", economyPower: 90, militaryPower: 60, resources: "سيليكون، خرسانة", status: "قوية", owner: null },
                        { name: "سيول", country: "كوريا الجنوبية", countryCode: "kr", continent: "آسيا", lat: 37.5665, lng: 126.9780, population: "51.7 مليون", economyPower: 80, militaryPower: 85, resources: "سيليكون، فولاذ، خرسانة", status: "قوية", owner: null },
                        { name: "كولومبو", country: "سريلانكا", countryCode: "lk", continent: "آسيا", lat: 6.9271, lng: 79.8612, population: "21.9 مليون", economyPower: 50, militaryPower: 35, resources: "شاي، سياحة، خشب", status: "مستقرة", owner: null },
                        { name: "دمشق", country: "سوريا", countryCode: "sy", continent: "آسيا", lat: 33.5138, lng: 36.2765, population: "18.3 مليون", economyPower: 25, militaryPower: 30, resources: "نفط، زراعة، خرسانة", status: "حرب", owner: null },
                        { name: "دوشنبه", country: "طاجيكستان", countryCode: "tj", continent: "آسيا", lat: 38.5598, lng: 68.7870, population: "9.9 مليون", economyPower: 35, militaryPower: 20, resources: "ألمنيوم، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "بانكوك", country: "تايلاند", countryCode: "th", continent: "آسيا", lat: 13.7563, lng: 100.5018, population: "71.6 مليون", economyPower: 65, militaryPower: 55, resources: "سياحة، زراعة، قصدير، خشب", status: "مستقرة", owner: null },
                        { name: "ديلي", country: "تيمور الشرقية", countryCode: "tl", continent: "آسيا", lat: -8.5569, lng: 125.5603, population: "1.3 مليون", economyPower: 30, militaryPower: 15, resources: "نفط، غاز، خشب", status: "مستقرة", owner: null },
                        { name: "أنقرة", country: "تركيا", countryCode: "tr", continent: "آسيا", lat: 39.9334, lng: 32.8597, population: "85.0 مليون", economyPower: 70, militaryPower: 80, resources: "كروم، فولاذ، خرسانة", status: "قوية", owner: null },
                        { name: "عشق آباد", country: "تركمانستان", countryCode: "tm", continent: "آسيا", lat: 37.9601, lng: 58.3261, population: "6.3 مليون", economyPower: 55, militaryPower: 30, resources: "غاز، نفط، خرسانة", status: "مستقرة", owner: null },
                        { name: "أبوظبي", country: "الإمارات", countryCode: "ae", continent: "آسيا", lat: 24.4539, lng: 54.3773, population: "9.9 مليون", economyPower: 80, militaryPower: 65, resources: "نفط، غاز، خرسانة", status: "قوية", owner: null },
                        { name: "طشقند", country: "أوزبكستان", countryCode: "uz", continent: "آسيا", lat: 41.2995, lng: 69.2401, population: "35.6 مليون", economyPower: 50, militaryPower: 35, resources: "ذهب، غاز، يورانيوم، خرسانة", status: "مستقرة", owner: null },
                        { name: "هانوي", country: "فيتنام", countryCode: "vn", continent: "آسيا", lat: 21.0278, lng: 105.8342, population: "98.5 مليون", economyPower: 55, militaryPower: 60, resources: "نفط، فوسفات، خشب", status: "مستقرة", owner: null },
                        { name: "صنعاء", country: "اليمن", countryCode: "ye", continent: "آسيا", lat: 15.3694, lng: 44.1910, population: "32.0 مليون", economyPower: 25, militaryPower: 25, resources: "نفط، غاز، خرسانة", status: "حرب", owner: null },
                        { name: "هونغ كونغ", country: "هونغ كونغ", countryCode: "hk", continent: "آسيا", lat: 22.3193, lng: 114.1694, population: "7.5 مليون", economyPower: 85, militaryPower: 5, resources: "سيليكون، خرسانة", status: "خاصة", owner: null },
                        { name: "ماكاو", country: "ماكاو", countryCode: "mo", continent: "آسيا", lat: 22.1987, lng: 113.5439, population: "0.7 مليون", economyPower: 75, militaryPower: 5, resources: "سياحة، خرسانة", status: "خاصة", owner: null },

                        // إفريقيا (54 دولة)
                        { name: "الجزائر", country: "الجزائر", countryCode: "dz", continent: "إفريقيا", lat: 36.7538, lng: 3.0588, population: "45.4 مليون", economyPower: 60, militaryPower: 55, resources: "نفط، غاز، حديد، خرسانة", status: "مستقرة", owner: null },
                        { name: "لواندا", country: "أنغولا", countryCode: "ao", continent: "إفريقيا", lat: -8.8383, lng: 13.2344, population: "36.7 مليون", economyPower: 50, militaryPower: 45, resources: "نفط، ألماس، خشب", status: "مستقرة", owner: null },
                        { name: "بورتو نوفو", country: "بنين", countryCode: "bj", continent: "إفريقيا", lat: 6.4969, lng: 2.6289, population: "13.0 مليون", economyPower: 35, militaryPower: 20, resources: "زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "غابورون", country: "بوتسوانا", countryCode: "bw", continent: "إفريقيا", lat: -24.6282, lng: 25.9231, population: "2.4 مليون", economyPower: 65, militaryPower: 25, resources: "ألماس، نحاس، خشب", status: "مستقرة", owner: null },
                        { name: "واغادوغو", country: "بوركينا فاسو", countryCode: "bf", continent: "إفريقيا", lat: 12.3714, lng: -1.5197, population: "22.1 مليون", economyPower: 30, militaryPower: 20, resources: "ذهب، زراعة، خشب", status: "غير مستقر", owner: null },
                        { name: "بوجومبورا", country: "بوروندي", countryCode: "bi", continent: "إفريقيا", lat: -3.3614, lng: 29.3599, population: "12.6 مليون", economyPower: 25, militaryPower: 15, resources: "زراعة، خشب", status: "غير مستقر", owner: null },
                        { name: "برايا", country: "الرأس الأخضر", countryCode: "cv", continent: "إفريقيا", lat: 14.9330, lng: -23.5133, population: "0.6 مليون", economyPower: 55, militaryPower: 10, resources: "سياحة، أسماك، خرسانة", status: "مستقرة", owner: null },
                        { name: "ياوندي", country: "الكاميرون", countryCode: "cm", continent: "إفريقيا", lat: 3.8480, lng: 11.5021, population: "28.0 مليون", economyPower: 45, militaryPower: 30, resources: "نفط، خشب، خرسانة", status: "مستقرة", owner: null },
                        { name: "بانغي", country: "أفريقيا الوسطى", countryCode: "cf", continent: "إفريقيا", lat: 4.3947, lng: 18.5582, population: "5.5 مليون", economyPower: 20, militaryPower: 10, resources: "ألماس، ذهب، خشب", status: "غير مستقر", owner: null },
                        { name: "انجامينا", country: "تشاد", countryCode: "td", continent: "إفريقيا", lat: 12.1348, lng: 15.0557, population: "17.7 مليون", economyPower: 35, militaryPower: 25, resources: "نفط، يورانيوم، خشب", status: "غير مستقر", owner: null },
                        { name: "موروني", country: "جزر القمر", countryCode: "km", continent: "إفريقيا", lat: -11.7172, lng: 43.2473, population: "0.9 مليون", economyPower: 30, militaryPower: 5, resources: "زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "برازافيل", country: "الكونغو", countryCode: "cg", continent: "إفريقيا", lat: -4.2634, lng: 15.2429, population: "5.8 مليون", economyPower: 40, militaryPower: 20, resources: "نفط، خشب", status: "مستقرة", owner: null },
                        { name: "كينشاسا", country: "الكونغو الديمقراطية", countryCode: "cd", continent: "إفريقيا", lat: -4.4419, lng: 15.2663, population: "102.3 مليون", economyPower: 25, militaryPower: 30, resources: "كوبالت، ألماس، نحاس، خشب", status: "غير مستقر", owner: null },
                        { name: "جيبوتي", country: "جيبوتي", countryCode: "dj", continent: "إفريقيا", lat: 11.8251, lng: 42.5903, population: "1.0 مليون", economyPower: 45, militaryPower: 20, resources: "ميناء، خدمات، خرسانة", status: "مستقرة", owner: null },
                        { name: "القاهرة", country: "مصر", countryCode: "eg", continent: "إفريقيا", lat: 30.0444, lng: 31.2357, population: "109.3 مليون", economyPower: 65, militaryPower: 75, resources: "نفط، فوسفات، خرسانة", status: "قوية", owner: null },
                        { name: "مالابو", country: "غينيا الاستوائية", countryCode: "gq", continent: "إفريقيا", lat: 3.7504, lng: 8.7371, population: "1.7 مليون", economyPower: 55, militaryPower: 15, resources: "نفط، خشب", status: "مستقرة", owner: null },
                        { name: "أسمرة", country: "إريتريا", countryCode: "er", continent: "إفريقيا", lat: 15.3229, lng: 38.9251, population: "3.7 مليون", economyPower: 25, militaryPower: 35, resources: "ذهب، نحاس، خشب", status: "مستقرة", owner: null },
                        { name: "مبابان", country: "إسواتيني", countryCode: "sz", continent: "إفريقيا", lat: -26.3054, lng: 31.1367, population: "1.2 مليون", economyPower: 35, militaryPower: 10, resources: "زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "أديس أبابا", country: "إثيوبيا", countryCode: "et", continent: "إفريقيا", lat: 9.0320, lng: 38.7463, population: "123.4 مليون", economyPower: 40, militaryPower: 50, resources: "زراعة، ذهب، خشب", status: "غير مستقر", owner: null },
                        { name: "ليبرفيل", country: "الغابون", countryCode: "ga", continent: "إفريقيا", lat: 0.4162, lng: 9.4673, population: "2.3 مليون", economyPower: 60, militaryPower: 20, resources: "نفط، غاز، خشب", status: "مستقرة", owner: null },
                        { name: "بانجول", country: "غامبيا", countryCode: "gm", continent: "إفريقيا", lat: 13.4539, lng: -16.5917, population: "2.6 مليون", economyPower: 30, militaryPower: 5, resources: "زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "أكرا", country: "غانا", countryCode: "gh", continent: "إفريقيا", lat: 5.6037, lng: -0.1870, population: "33.5 مليون", economyPower: 50, militaryPower: 30, resources: "ذهب، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "كوناكري", country: "غينيا", countryCode: "gn", continent: "إفريقيا", lat: 9.6412, lng: -13.5784, population: "13.9 مليون", economyPower: 35, militaryPower: 20, resources: "بوكسيت، ذهب، خشب", status: "غير مستقر", owner: null },
                        { name: "بيساو", country: "غينيا بيساو", countryCode: "gw", continent: "إفريقيا", lat: 11.8636, lng: -15.5846, population: "2.1 مليون", economyPower: 25, militaryPower: 10, resources: "زراعة، خشب", status: "غير مستقر", owner: null },
                        { name: "ياموسوكرو", country: "ساحل العاج", countryCode: "ci", continent: "إفريقيا", lat: 6.8276, lng: -5.2893, population: "28.2 مليون", economyPower: 55, militaryPower: 25, resources: "زراعة، ذهب، خشب", status: "مستقرة", owner: null },
                        { name: "نيروبي", country: "كينيا", countryCode: "ke", continent: "إفريقيا", lat: -1.2921, lng: 36.8219, population: "57.0 مليون", economyPower: 50, militaryPower: 35, resources: "زراعة، سياحة، خشب", status: "مستقرة", owner: null },
                        { name: "ماسيرو", country: "ليسوتو", countryCode: "ls", continent: "إفريقيا", lat: -29.3101, lng: 27.4785, population: "2.2 مليون", economyPower: 35, militaryPower: 10, resources: "ألماس، خشب", status: "مستقرة", owner: null },
                        { name: "مونروفيا", country: "ليبيريا", countryCode: "lr", continent: "إفريقيا", lat: 6.2907, lng: -10.7605, population: "5.4 مليون", economyPower: 30, militaryPower: 10, resources: "حديد، خشب", status: "مستقرة", owner: null },
                        { name: "طرابلس", country: "ليبيا", countryCode: "ly", continent: "إفريقيا", lat: 32.8872, lng: 13.1913, population: "7.1 مليون", economyPower: 40, militaryPower: 15, resources: "نفط، خرسانة", status: "غير مستقر", owner: null },
                        { name: "أنتاناناريفو", country: "مدغشقر", countryCode: "mg", continent: "إفريقيا", lat: -18.8792, lng: 47.5079, population: "29.6 مليون", economyPower: 35, militaryPower: 20, resources: "زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "ليلونغوي", country: "ملاوي", countryCode: "mw", continent: "إفريقيا", lat: -13.9626, lng: 33.7741, population: "20.4 مليون", economyPower: 30, militaryPower: 15, resources: "زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "باماكو", country: "مالي", countryCode: "ml", continent: "إفريقيا", lat: 12.6392, lng: -8.0029, population: "22.6 مليون", economyPower: 35, militaryPower: 20, resources: "ذهب، يورانيوم، خشب", status: "غير مستقر", owner: null },
                        { name: "نواكشوط", country: "موريتانيا", countryCode: "mr", continent: "إفريقيا", lat: 18.0735, lng: -15.9582, population: "4.9 مليون", economyPower: 40, militaryPower: 20, resources: "حديد، أسماك، خشب", status: "مستقرة", owner: null },
                        { name: "بورت لويس", country: "موريشيوس", countryCode: "mu", continent: "إفريقيا", lat: -20.1609, lng: 57.5012, population: "1.3 مليون", economyPower: 65, militaryPower: 5, resources: "سياحة، خرسانة", status: "مستقرة", owner: null },
                        { name: "الرباط", country: "المغرب", countryCode: "ma", continent: "إفريقيا", lat: 34.0209, lng: -6.8416, population: "37.8 مليون", economyPower: 55, militaryPower: 55, resources: "فوسفات، زراعة، خرسانة", status: "مستقرة", owner: null },
                        { name: "مابوتو", country: "موزمبيق", countryCode: "mz", continent: "إفريقيا", lat: -25.9692, lng: 32.5732, population: "33.9 مليون", economyPower: 35, militaryPower: 25, resources: "غاز، ألمنيوم، خشب", status: "مستقرة", owner: null },
                        { name: "ويندهوك", country: "ناميبيا", countryCode: "na", continent: "إفريقيا", lat: -22.5609, lng: 17.0658, population: "2.6 مليون", economyPower: 50, militaryPower: 20, resources: "ألماس، يورانيوم، خشب", status: "مستقرة", owner: null },
                        { name: "نيامي", country: "النيجر", countryCode: "ne", continent: "إفريقيا", lat: 13.5116, lng: 2.1254, population: "27.2 مليون", economyPower: 30, militaryPower: 15, resources: "يورانيوم، ذهب، خشب", status: "غير مستقر", owner: null },
                        { name: "أبوجا", country: "نيجيريا", countryCode: "ng", continent: "إفريقيا", lat: 9.0765, lng: 7.3986, population: "223.8 مليون", economyPower: 55, militaryPower: 60, resources: "نفط، قصدير، خشب", status: "مستقرة", owner: null },
                        { name: "كيغالي", country: "رواندا", countryCode: "rw", continent: "إفريقيا", lat: -1.9441, lng: 30.0619, population: "14.0 مليون", economyPower: 45, militaryPower: 30, resources: "زراعة، قصدير، خشب", status: "مستقرة", owner: null },
                        { name: "ساو تومي", country: "ساو تومي وبرينسيبي", countryCode: "st", continent: "إفريقيا", lat: 0.3302, lng: 6.7333, population: "0.2 مليون", economyPower: 40, militaryPower: 5, resources: "زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "داكار", country: "السنغال", countryCode: "sn", continent: "إفريقيا", lat: 14.6928, lng: -17.4467, population: "18.0 مليون", economyPower: 45, militaryPower: 25, resources: "زراعة، فوسفات، خشب", status: "مستقرة", owner: null },
                        { name: "فيكتوريا", country: "سيشل", countryCode: "sc", continent: "إفريقيا", lat: -4.6203, lng: 55.4550, population: "0.1 مليون", economyPower: 70, militaryPower: 5, resources: "سياحة، خرسانة", status: "مستقرة", owner: null },
                        { name: "فريتاون", country: "سيراليون", countryCode: "sl", continent: "إفريقيا", lat: 8.4840, lng: -13.2299, population: "8.6 مليون", economyPower: 35, militaryPower: 15, resources: "ألماس، تيتانيوم، خشب", status: "مستقرة", owner: null },
                        { name: "مقديشو", country: "الصومال", countryCode: "so", continent: "إفريقيا", lat: 2.0469, lng: 45.3182, population: "17.6 مليون", economyPower: 25, militaryPower: 15, resources: "زراعة، يورانيوم، خشب", status: "غير مستقر", owner: null },
                        { name: "بريتوريا", country: "جنوب أفريقيا", countryCode: "za", continent: "إفريقيا", lat: -25.7479, lng: 28.2293, population: "60.8 مليون", economyPower: 60, militaryPower: 65, resources: "ذهب، ألماس، بلاتين، خرسانة", status: "قوية", owner: null },
                        { name: "جوبا", country: "جنوب السودان", countryCode: "ss", continent: "إفريقيا", lat: 4.8594, lng: 31.5713, population: "11.4 مليون", economyPower: 20, militaryPower: 20, resources: "نفط، خشب", status: "غير مستقر", owner: null },
                        { name: "الخرطوم", country: "السودان", countryCode: "sd", continent: "إفريقيا", lat: 15.5007, lng: 32.5599, population: "47.5 مليون", economyPower: 35, militaryPower: 35, resources: "نفط، ذهب، خشب", status: "حرب", owner: null },
                        { name: "دودوما", country: "تنزانيا", countryCode: "tz", continent: "إفريقيا", lat: -6.1630, lng: 35.7516, population: "65.5 مليون", economyPower: 45, militaryPower: 30, resources: "ذهب، يورانيوم، خشب", status: "مستقرة", owner: null },
                        { name: "لومي", country: "توغو", countryCode: "tg", continent: "إفريقيا", lat: 6.1725, lng: 1.2314, population: "8.8 مليون", economyPower: 40, militaryPower: 15, resources: "فوسفات، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "تونس", country: "تونس", countryCode: "tn", continent: "إفريقيا", lat: 36.8065, lng: 10.1815, population: "12.3 مليون", economyPower: 50, militaryPower: 30, resources: "فوسفات، سياحة، خرسانة", status: "مستقرة", owner: null },
                        { name: "كمبالا", country: "أوغندا", countryCode: "ug", continent: "إفريقيا", lat: 0.3476, lng: 32.5825, population: "48.6 مليون", economyPower: 40, militaryPower: 35, resources: "زراعة، نحاس، خشب", status: "مستقرة", owner: null },
                        { name: "لوساكا", country: "زامبيا", countryCode: "zm", continent: "إفريقيا", lat: -15.3875, lng: 28.3228, population: "20.0 مليون", economyPower: 45, militaryPower: 25, resources: "نحاس، كوبالت، خشب", status: "مستقرة", owner: null },
                        { name: "هراري", country: "زيمبابوي", countryCode: "zw", continent: "إفريقيا", lat: -17.8252, lng: 31.0335, population: "16.7 مليون", economyPower: 30, militaryPower: 20, resources: "بلاتين، ذهب، خشب", status: "مستقرة", owner: null },

                        // أوروبا (44 دولة)
                        { name: "تيرانا", country: "ألبانيا", countryCode: "al", continent: "أوروبا", lat: 41.3275, lng: 19.8187, population: "2.8 مليون", economyPower: 45, militaryPower: 25, resources: "زراعة، سياحة، خشب", status: "مستقرة", owner: null },
                        { name: "أندورا لا فيلا", country: "أندورا", countryCode: "ad", continent: "أوروبا", lat: 42.5063, lng: 1.5218, population: "0.08 مليون", economyPower: 70, militaryPower: 5, resources: "سياحة، خشب", status: "مستقرة", owner: null },
                        { name: "فيينا", country: "النمسا", countryCode: "at", continent: "أوروبا", lat: 48.2082, lng: 16.3738, population: "9.0 مليون", economyPower: 75, militaryPower: 40, resources: "سياحة، خشب، خرسانة", status: "مستقرة", owner: null },
                        { name: "مينسك", country: "بيلاروسيا", countryCode: "by", continent: "أوروبا", lat: 53.9045, lng: 27.5615, population: "9.4 مليون", economyPower: 55, militaryPower: 55, resources: "بوتاس، خشب، خرسانة", status: "مستقرة", owner: null },
                        { name: "بروكسل", country: "بلجيكا", countryCode: "be", continent: "أوروبا", lat: 50.8503, lng: 4.3517, population: "11.6 مليون", economyPower: 80, militaryPower: 45, resources: "صناعة، خرسانة", status: "مستقرة", owner: null },
                        { name: "سراييفو", country: "البوسنة والهرسك", countryCode: "ba", continent: "أوروبا", lat: 43.8563, lng: 18.4131, population: "3.3 مليون", economyPower: 45, militaryPower: 25, resources: "ألمنيوم، خشب، خرسانة", status: "مستقرة", owner: null },
                        { name: "صوفيا", country: "بلغاريا", countryCode: "bg", continent: "أوروبا", lat: 42.6977, lng: 23.3219, population: "6.9 مليون", economyPower: 50, militaryPower: 35, resources: "زراعة، نحاس، خرسانة", status: "مستقرة", owner: null },
                        { name: "زغرب", country: "كرواتيا", countryCode: "hr", continent: "أوروبا", lat: 45.8150, lng: 15.9819, population: "4.0 مليون", economyPower: 60, militaryPower: 30, resources: "سياحة، خشب، خرسانة", status: "مستقرة", owner: null },
                        { name: "براغ", country: "التشيك", countryCode: "cz", continent: "أوروبا", lat: 50.0755, lng: 14.4378, population: "10.7 مليون", economyPower: 70, militaryPower: 45, resources: "فحم، يورانيوم، خرسانة", status: "مستقرة", owner: null },
                        { name: "كوبنهاغن", country: "الدنمارك", countryCode: "dk", continent: "أوروبا", lat: 55.6761, lng: 12.5683, population: "5.9 مليون", economyPower: 80, militaryPower: 50, resources: "طاقة، نفط، خرسانة", status: "مستقرة", owner: null },
                        { name: "تالين", country: "إستونيا", countryCode: "ee", continent: "أوروبا", lat: 59.4370, lng: 24.7536, population: "1.3 مليون", economyPower: 65, militaryPower: 30, resources: "صخر زيتي، خشب، خرسانة", status: "مستقرة", owner: null },
                        { name: "هلسنكي", country: "فنلندا", countryCode: "fi", continent: "أوروبا", lat: 60.1699, lng: 24.9384, population: "5.5 مليون", economyPower: 75, militaryPower: 50, resources: "خشب، نحاس، خرسانة", status: "مستقرة", owner: null },
                        { name: "باريس", country: "فرنسا", countryCode: "fr", continent: "أوروبا", lat: 48.8566, lng: 2.3522, population: "68.0 مليون", economyPower: 85, militaryPower: 85, resources: "يورانيوم، حديد، خرسانة", status: "قوية", owner: null },
                        { name: "برلين", country: "ألمانيا", countryCode: "de", continent: "أوروبا", lat: 52.5200, lng: 13.4050, population: "83.2 مليون", economyPower: 90, militaryPower: 80, resources: "فحم، حديد، خرسانة", status: "قوية", owner: null },
                        { name: "أثينا", country: "اليونان", countryCode: "gr", continent: "أوروبا", lat: 37.9838, lng: 23.7275, population: "10.4 مليون", economyPower: 55, militaryPower: 45, resources: "سياحة، رخام، خرسانة", status: "مستقرة", owner: null },
                        { name: "بودابست", country: "المجر", countryCode: "hu", continent: "أوروبا", lat: 47.4979, lng: 19.0402, population: "9.6 مليون", economyPower: 60, militaryPower: 35, resources: "بوكسيت، خشب، خرسانة", status: "مستقرة", owner: null },
                        { name: "ريكيافيك", country: "آيسلندا", countryCode: "is", continent: "أوروبا", lat: 64.1265, lng: -21.8174, population: "0.4 مليون", economyPower: 70, militaryPower: 10, resources: "طاقة، ألومنيوم، خرسانة", status: "مستقرة", owner: null },
                        { name: "دبلن", country: "أيرلندا", countryCode: "ie", continent: "أوروبا", lat: 53.3498, lng: -6.2603, population: "5.0 مليون", economyPower: 70, militaryPower: 30, resources: "برمجيات، زراعة، خرسانة", status: "مستقرة", owner: null },
                        { name: "روما", country: "إيطاليا", countryCode: "it", continent: "أوروبا", lat: 41.9028, lng: 12.4964, population: "59.1 مليون", economyPower: 75, militaryPower: 65, resources: "رخام، سياحة، خرسانة", status: "قوية", owner: null },
                        { name: "ريغا", country: "لاتفيا", countryCode: "lv", continent: "أوروبا", lat: 56.9496, lng: 24.1052, population: "1.9 مليون", economyPower: 60, militaryPower: 25, resources: "خشب، عنبر، خرسانة", status: "مستقرة", owner: null },
                        { name: "فيلنيوس", country: "ليتوانيا", countryCode: "lt", continent: "أوروبا", lat: 54.6872, lng: 25.2797, population: "2.8 مليون", economyPower: 65, militaryPower: 30, resources: "كهرمان، خشب، خرسانة", status: "مستقرة", owner: null },
                        { name: "لوكسمبورغ", country: "لوكسمبورغ", countryCode: "lu", continent: "أوروبا", lat: 49.6116, lng: 6.1319, population: "0.6 مليون", economyPower: 85, militaryPower: 10, resources: "مصارف، خرسانة", status: "مستقرة", owner: null },
                        { name: "فاليتا", country: "مالطا", countryCode: "mt", continent: "أوروبا", lat: 35.9042, lng: 14.5189, population: "0.5 مليون", economyPower: 70, militaryPower: 15, resources: "سياحة، خرسانة", status: "مستقرة", owner: null },
                        { name: "شيسيناو", country: "مولدوفا", countryCode: "md", continent: "أوروبا", lat: 47.0105, lng: 28.8638, population: "2.6 مليون", economyPower: 40, militaryPower: 20, resources: "زراعة، خرسانة", status: "مستقرة", owner: null },
                        { name: "موناكو", country: "موناكو", countryCode: "mc", continent: "أوروبا", lat: 43.7384, lng: 7.4246, population: "0.04 مليون", economyPower: 90, militaryPower: 5, resources: "سياحة، خرسانة", status: "مستقرة", owner: null },
                        { name: "بودغوريتسا", country: "الجبل الأسود", countryCode: "me", continent: "أوروبا", lat: 42.4304, lng: 19.2594, population: "0.6 مليون", economyPower: 50, militaryPower: 15, resources: "سياحة، خشب، خرسانة", status: "مستقرة", owner: null },
                        { name: "أمستردام", country: "هولندا", countryCode: "nl", continent: "أوروبا", lat: 52.3676, lng: 4.9041, population: "17.5 مليون", economyPower: 85, militaryPower: 55, resources: "غاز، زراعة، خرسانة", status: "مستقرة", owner: null },
                        { name: "سكوبي", country: "مقدونيا الشمالية", countryCode: "mk", continent: "أوروبا", lat: 41.9973, lng: 21.4280, population: "2.1 مليون", economyPower: 45, militaryPower: 20, resources: "نيكل، خشب، خرسانة", status: "مستقرة", owner: null },
                        { name: "أوسلو", country: "النرويج", countryCode: "no", continent: "أوروبا", lat: 59.9139, lng: 10.7522, population: "5.5 مليون", economyPower: 85, militaryPower: 50, resources: "نفط، غاز، خشب، خرسانة", status: "مستقرة", owner: null },
                        { name: "وارسو", country: "بولندا", countryCode: "pl", continent: "أوروبا", lat: 52.2297, lng: 21.0122, population: "37.7 مليون", economyPower: 70, militaryPower: 65, resources: "فحم، نحاس، خرسانة", status: "مستقرة", owner: null },
                        { name: "لشبونة", country: "البرتغال", countryCode: "pt", continent: "أوروبا", lat: 38.7223, lng: -9.1393, population: "10.3 مليون", economyPower: 65, militaryPower: 40, resources: "فلين، سياحة، خرسانة", status: "مستقرة", owner: null },
                        { name: "بوخارست", country: "رومانيا", countryCode: "ro", continent: "أوروبا", lat: 44.4268, lng: 26.1025, population: "19.0 مليون", economyPower: 60, militaryPower: 45, resources: "نفط، خشب، خرسانة", status: "مستقرة", owner: null },
                        { name: "موسكو", country: "روسيا", countryCode: "ru", continent: "أوروبا", lat: 55.7558, lng: 37.6173, population: "144.1 مليون", economyPower: 70, militaryPower: 90, resources: "نفط، غاز، يورانيوم، خرسانة", status: "قوية", owner: null },
                        { name: "سان مارينو", country: "سان مارينو", countryCode: "sm", continent: "أوروبا", lat: 43.9424, lng: 12.4578, population: "0.03 مليون", economyPower: 70, militaryPower: 5, resources: "سياحة، خرسانة", status: "مستقرة", owner: null },
                        { name: "بلغراد", country: "صربيا", countryCode: "rs", continent: "أوروبا", lat: 44.7866, lng: 20.4489, population: "6.7 مليون", economyPower: 55, militaryPower: 40, resources: "زراعة، نحاس، خرسانة", status: "مستقرة", owner: null },
                        { name: "براتيسلافا", country: "سلوفاكيا", countryCode: "sk", continent: "أوروبا", lat: 48.1486, lng: 17.1077, population: "5.5 مليون", economyPower: 65, militaryPower: 30, resources: "سيارات، خشب، خرسانة", status: "مستقرة", owner: null },
                        { name: "ليوبليانا", country: "سلوفينيا", countryCode: "si", continent: "أوروبا", lat: 46.0569, lng: 14.5058, population: "2.1 مليون", economyPower: 70, militaryPower: 25, resources: "خشب، خرسانة", status: "مستقرة", owner: null },
                        { name: "مدريد", country: "إسبانيا", countryCode: "es", continent: "أوروبا", lat: 40.4168, lng: -3.7038, population: "47.4 مليون", economyPower: 75, militaryPower: 65, resources: "زراعة، سياحة، خرسانة", status: "قوية", owner: null },
                        { name: "ستوكهولم", country: "السويد", countryCode: "se", continent: "أوروبا", lat: 59.3293, lng: 18.0686, population: "10.4 مليون", economyPower: 80, militaryPower: 55, resources: "خشب، حديد، خرسانة", status: "مستقرة", owner: null },
                        { name: "برن", country: "سويسرا", countryCode: "ch", continent: "أوروبا", lat: 46.9480, lng: 7.4474, population: "8.7 مليون", economyPower: 90, militaryPower: 30, resources: "مصارف، ساعات، خرسانة", status: "مستقرة", owner: null },
                        { name: "كييف", country: "أوكرانيا", countryCode: "ua", continent: "أوروبا", lat: 50.4501, lng: 30.5234, population: "43.8 مليون", economyPower: 50, militaryPower: 60, resources: "قمح، حديد، خرسانة", status: "حرب", owner: null },
                        { name: "لندن", country: "المملكة المتحدة", countryCode: "gb", continent: "أوروبا", lat: 51.5074, lng: -0.1278, population: "67.3 مليون", economyPower: 85, militaryPower: 85, resources: "نفط، غاز، خرسانة", status: "قوية", owner: null },
                        { name: "الفاتيكان", country: "الفاتيكان", countryCode: "va", continent: "أوروبا", lat: 41.9029, lng: 12.4534, population: "0.0008 مليون", economyPower: 95, militaryPower: 0, resources: "سياحة، خرسانة", status: "خاصة", owner: null },

                        // أمريكا الشمالية (23 دولة)
                        { name: "سانت جونز", country: "أنتيغوا وباربودا", countryCode: "ag", continent: "أمريكا الشمالية", lat: 17.1172, lng: -61.8456, population: "0.1 مليون", economyPower: 55, militaryPower: 10, resources: "سياحة، خشب", status: "مستقرة", owner: null },
                        { name: "ناسو", country: "باهاماس", countryCode: "bs", continent: "أمريكا الشمالية", lat: 25.0478, lng: -77.3554, population: "0.4 مليون", economyPower: 70, militaryPower: 15, resources: "سياحة، خشب", status: "مستقرة", owner: null },
                        { name: "بريدج تاون", country: "باربادوس", countryCode: "bb", continent: "أمريكا الشمالية", lat: 13.0975, lng: -59.6165, population: "0.3 مليون", economyPower: 65, militaryPower: 10, resources: "سياحة، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "بلموبان", country: "بليز", countryCode: "bz", continent: "أمريكا الشمالية", lat: 17.2510, lng: -88.7590, population: "0.4 مليون", economyPower: 50, militaryPower: 15, resources: "سياحة، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "أوتاوا", country: "كندا", countryCode: "ca", continent: "أمريكا الشمالية", lat: 45.4215, lng: -75.6972, population: "38.3 مليون", economyPower: 80, militaryPower: 70, resources: "نفط، يورانيوم، خشب", status: "قوية", owner: null },
                        { name: "سان خوسيه", country: "كوستاريكا", countryCode: "cr", continent: "أمريكا الشمالية", lat: 9.9281, lng: -84.0907, population: "5.2 مليون", economyPower: 60, militaryPower: 15, resources: "سياحة، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "هافانا", country: "كوبا", countryCode: "cu", continent: "أمريكا الشمالية", lat: 23.1136, lng: -82.3666, population: "11.3 مليون", economyPower: 45, militaryPower: 40, resources: "سياحة، زراعة، نيكل", status: "مستقرة", owner: null },
                        { name: "روسو", country: "دومينيكا", countryCode: "dm", continent: "أمريكا الشمالية", lat: 15.2976, lng: -61.3900, population: "0.07 مليون", economyPower: 50, militaryPower: 5, resources: "سياحة، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "سانتو دومينغو", country: "جمهورية الدومينيكان", countryCode: "do", continent: "أمريكا الشمالية", lat: 18.4861, lng: -69.9312, population: "11.1 مليون", economyPower: 55, militaryPower: 30, resources: "سياحة، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "سان سلفادور", country: "السلفادور", countryCode: "sv", continent: "أمريكا الشمالية", lat: 13.6929, lng: -89.2182, population: "6.5 مليون", economyPower: 50, militaryPower: 25, resources: "زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "سانت جورج", country: "غرينادا", countryCode: "gd", continent: "أمريكا الشمالية", lat: 12.0561, lng: -61.7488, population: "0.1 مليون", economyPower: 55, militaryPower: 5, resources: "سياحة، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "غواتيمالا", country: "غواتيمالا", countryCode: "gt", continent: "أمريكا الشمالية", lat: 14.6349, lng: -90.5069, population: "18.2 مليون", economyPower: 50, militaryPower: 25, resources: "زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "بورت أو برنس", country: "هايتي", countryCode: "ht", continent: "أمريكا الشمالية", lat: 18.5944, lng: -72.3074, population: "11.7 مليون", economyPower: 25, militaryPower: 10, resources: "زراعة، خشب", status: "غير مستقر", owner: null },
                        { name: "تيغوسيغالبا", country: "هندوراس", countryCode: "hn", continent: "أمريكا الشمالية", lat: 14.0723, lng: -87.1921, population: "10.3 مليون", economyPower: 45, militaryPower: 20, resources: "زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "كينغستون", country: "جامايكا", countryCode: "jm", continent: "أمريكا الشمالية", lat: 17.9714, lng: -76.7931, population: "2.8 مليون", economyPower: 55, militaryPower: 15, resources: "سياحة، بوكسيت، خشب", status: "مستقرة", owner: null },
                        { name: "مكسيكو سيتي", country: "المكسيك", countryCode: "mx", continent: "أمريكا الشمالية", lat: 19.4326, lng: -99.1332, population: "128.9 مليون", economyPower: 65, militaryPower: 60, resources: "نفط، فضة، خشب", status: "مستقرة", owner: null },
                        { name: "ماناغوا", country: "نيكاراغوا", countryCode: "ni", continent: "أمريكا الشمالية", lat: 12.1364, lng: -86.2514, population: "6.9 مليون", economyPower: 40, militaryPower: 20, resources: "زراعة، ذهب، خشب", status: "مستقرة", owner: null },
                        { name: "بنما", country: "بنما", countryCode: "pa", continent: "أمريكا الشمالية", lat: 8.9824, lng: -79.5199, population: "4.4 مليون", economyPower: 65, militaryPower: 20, resources: "قناة بنما، خدمات، خشب", status: "مستقرة", owner: null },
                        { name: "باسيتير", country: "سانت كيتس ونيفيس", countryCode: "kn", continent: "أمريكا الشمالية", lat: 17.3026, lng: -62.7177, population: "0.05 مليون", economyPower: 60, militaryPower: 5, resources: "سياحة، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "كاستريس", country: "سانت لوسيا", countryCode: "lc", continent: "أمريكا الشمالية", lat: 14.0101, lng: -60.9875, population: "0.2 مليون", economyPower: 55, militaryPower: 5, resources: "سياحة، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "كينغستاون", country: "سانت فنسنت والغرينادين", countryCode: "vc", continent: "أمريكا الشمالية", lat: 13.1600, lng: -61.2248, population: "0.1 مليون", economyPower: 50, militaryPower: 5, resources: "سياحة، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "بورت أوف سبين", country: "ترينيداد وتوباغو", countryCode: "tt", continent: "أمريكا الشمالية", lat: 10.6549, lng: -61.5019, population: "1.4 مليون", economyPower: 65, militaryPower: 20, resources: "نفط، غاز، خشب", status: "مستقرة", owner: null },
                        { name: "واشنطن", country: "الولايات المتحدة", countryCode: "us", continent: "أمريكا الشمالية", lat: 38.9072, lng: -77.0369, population: "331.9 مليون", economyPower: 95, militaryPower: 95, resources: "نفط، غاز، يورانيوم، خشب", status: "قوية", owner: null },

                        // أمريكا الجنوبية (12 دولة)
                        { name: "بوينس آيرس", country: "الأرجنتين", countryCode: "ar", continent: "أمريكا الجنوبية", lat: -34.6037, lng: -58.3816, population: "45.8 مليون", economyPower: 65, militaryPower: 55, resources: "زراعة، ليثيوم، خشب", status: "مستقرة", owner: null },
                        { name: "لاباز", country: "بوليفيا", countryCode: "bo", continent: "أمريكا الجنوبية", lat: -16.4897, lng: -68.1193, population: "12.0 مليون", economyPower: 45, militaryPower: 30, resources: "غاز، ليثيوم، خشب", status: "مستقرة", owner: null },
                        { name: "برازيليا", country: "البرازيل", countryCode: "br", continent: "أمريكا الجنوبية", lat: -15.7975, lng: -47.8919, population: "214.0 مليون", economyPower: 75, militaryPower: 75, resources: "زراعة، حديد، خشب", status: "قوية", owner: null },
                        { name: "سانتياغو", country: "تشيلي", countryCode: "cl", continent: "أمريكا الجنوبية", lat: -33.4489, lng: -70.6693, population: "19.5 مليون", economyPower: 70, militaryPower: 60, resources: "نحاس، ليثيوم، خشب", status: "مستقرة", owner: null },
                        { name: "بوغوتا", country: "كولومبيا", countryCode: "co", continent: "أمريكا الجنوبية", lat: 4.7110, lng: -74.0721, population: "51.5 مليون", economyPower: 60, militaryPower: 55, resources: "نفط، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "كيتو", country: "الإكوادور", countryCode: "ec", continent: "أمريكا الجنوبية", lat: -0.1807, lng: -78.4678, population: "17.8 مليون", economyPower: 55, militaryPower: 35, resources: "نفط، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "جورج تاون", country: "غيانا", countryCode: "gy", continent: "أمريكا الجنوبية", lat: 6.8013, lng: -58.1551, population: "0.8 مليون", economyPower: 50, militaryPower: 15, resources: "ذهب، بوكسيت، خشب", status: "مستقرة", owner: null },
                        { name: "أسونسيون", country: "باراغواي", countryCode: "py", continent: "أمريكا الجنوبية", lat: -25.2637, lng: -57.5759, population: "7.3 مليون", economyPower: 45, militaryPower: 25, resources: "كهرباء، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "ليما", country: "بيرو", countryCode: "pe", continent: "أمريكا الجنوبية", lat: -12.0464, lng: -77.0428, population: "33.7 مليون", economyPower: 55, militaryPower: 45, resources: "نحاس، فضة، خشب", status: "مستقرة", owner: null },
                        { name: "باراماريبو", country: "سورينام", countryCode: "sr", continent: "أمريكا الجنوبية", lat: 5.8520, lng: -55.2038, population: "0.6 مليون", economyPower: 50, militaryPower: 15, resources: "بوكسيت، ذهب، خشب", status: "مستقرة", owner: null },
                        { name: "مونتفيديو", country: "أوروغواي", countryCode: "uy", continent: "أمريكا الجنوبية", lat: -34.9011, lng: -56.1645, population: "3.5 مليون", economyPower: 65, militaryPower: 30, resources: "زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "كاراكاس", country: "فنزويلا", countryCode: "ve", continent: "أمريكا الجنوبية", lat: 10.4806, lng: -66.9036, population: "28.4 مليون", economyPower: 30, militaryPower: 40, resources: "نفط، غاز، خشب", status: "غير مستقر", owner: null },

                        // أوقيانوسيا (14 دولة)
                        { name: "كانبرا", country: "أستراليا", countryCode: "au", continent: "أوقيانوسيا", lat: -35.2809, lng: 149.1300, population: "25.7 مليون", economyPower: 80, militaryPower: 70, resources: "حديد، فحم، يورانيوم، خشب", status: "قوية", owner: null },
                        { name: "سوفا", country: "فيجي", countryCode: "fj", continent: "أوقيانوسيا", lat: -18.1248, lng: 178.4501, population: "0.9 مليون", economyPower: 55, militaryPower: 20, resources: "سياحة، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "تاراوا", country: "كيريباتي", countryCode: "ki", continent: "أوقيانوسيا", lat: 1.3282, lng: 172.9750, population: "0.1 مليون", economyPower: 35, militaryPower: 5, resources: "أسماك، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "ماجورو", country: "جزر مارشال", countryCode: "mh", continent: "أوقيانوسيا", lat: 7.1164, lng: 171.1854, population: "0.06 مليون", economyPower: 40, militaryPower: 5, resources: "أسماك، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "باليكير", country: "ولايات ميكرونيسيا المتحدة", countryCode: "fm", continent: "أوقيانوسيا", lat: 6.9178, lng: 158.1850, population: "0.1 مليون", economyPower: 35, militaryPower: 5, resources: "أسماك، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "يارين", country: "ناورو", countryCode: "nr", continent: "أوقيانوسيا", lat: -0.5477, lng: 166.9209, population: "0.01 مليون", economyPower: 45, militaryPower: 5, resources: "فوسفات، خشب", status: "مستقرة", owner: null },
                        { name: "ويلينغتون", country: "نيوزيلندا", countryCode: "nz", continent: "أوقيانوسيا", lat: -41.2865, lng: 174.7762, population: "5.1 مليون", economyPower: 75, militaryPower: 45, resources: "زراعة، سياحة، خشب", status: "مستقرة", owner: null },
                        { name: "كورور", country: "بالاو", countryCode: "pw", continent: "أوقيانوسيا", lat: 7.3419, lng: 134.4781, population: "0.02 مليون", economyPower: 60, militaryPower: 5, resources: "سياحة، أسماك، خشب", status: "مستقرة", owner: null },
                        { name: "بورت مورسبي", country: "بابوا غينيا الجديدة", countryCode: "pg", continent: "أوقيانوسيا", lat: -9.4438, lng: 147.1803, population: "9.1 مليون", economyPower: 45, militaryPower: 20, resources: "ذهب، غاز، خشب", status: "مستقرة", owner: null },
                        { name: "أبيا", country: "ساموا", countryCode: "ws", continent: "أوقيانوسيا", lat: -13.8333, lng: -171.7667, population: "0.2 مليون", economyPower: 50, militaryPower: 5, resources: "سياحة، زراعة، خشب", status: "مستقرة", owner: null },
                        { name: "هونيارا", country: "جزر سليمان", countryCode: "sb", continent: "أوقيانوسيا", lat: -9.4456, lng: 159.9729, population: "0.7 مليون", economyPower: 40, militaryPower: 10, resources: "أخشاب، أسماك", status: "مستقرة", owner: null },
                        { name: "نوكو ألوفا", country: "تونغا", countryCode: "to", continent: "أوقيانوسيا", lat: -21.1393, lng: -175.2049, population: "0.1 مليون", economyPower: 45, militaryPower: 5, resources: "سياحة، أسماك، خشب", status: "مستقرة", owner: null },
                        { name: "فونافوتي", country: "توفالو", countryCode: "tv", continent: "أوقيانوسيا", lat: -8.5167, lng: 179.2167, population: "0.01 مليون", economyPower: 35, militaryPower: 5, resources: "أسماك، خشب", status: "مستقرة", owner: null },
                        { name: "بورت فيلا", country: "فانواتو", countryCode: "vu", continent: "أوقيانوسيا", lat: -17.7333, lng: 168.3273, population: "0.3 مليون", economyPower: 40, militaryPower: 5, resources: "سياحة، زراعة، خشب", status: "مستقرة", owner: null }
                    ];
                    
                    // تطبيق بيانات الملكية من اللاعبين الحاليين
                    this.applyOwnershipFromPlayers();
                },
                
                applyOwnershipFromPlayers: function() {
                    // تحديث ملكية الدول بناءً على اللاعبين الحاليين
                    for (const playerId in this.players) {
                        const player = this.players[playerId];
                        if (player.country && player.countryName) {
                            const country = this.worldCapitals.find(c => 
                                c.country === player.countryName || c.countryCode === player.country
                            );
                            if (country) {
                                country.owner = player.name;
                                country.status = "محتل";
                            }
                        }
                    }
                },
                
                updateStats: function() {
                    const totalCountries = this.worldCapitals.length;
                    const occupiedCountries = this.worldCapitals.filter(c => c.owner !== null).length;
                    const freeCountries = totalCountries - occupiedCountries;
                    const totalPlayers = Object.keys(this.players).length;
                    
                    document.getElementById('total-players').textContent = totalPlayers;
                    document.getElementById('total-countries').textContent = totalCountries;
                    document.getElementById('occupied-countries').textContent = occupiedCountries;
                    document.getElementById('free-countries').textContent = freeCountries;
                },
                
                renderContinentTabs: function() {
                    const continents = ['all', 'آسيا', 'إفريقيا', 'أوروبا', 'أمريكا الشمالية', 'أمريكا الجنوبية', 'أوقيانوسيا'];
                    const continentNames = {
                        'all': 'كل الدول',
                        'آسيا': 'آسيا',
                        'إفريقيا': 'إفريقيا',
                        'أوروبا': 'أوروبا',
                        'أمريكا الشمالية': 'أمريكا الشمالية',
                        'أمريكا الجنوبية': 'أمريكا الجنوبية',
                        'أوقيانوسيا': 'أوقيانوسيا'
                    };
                    
                    const tabsContainer = document.getElementById('continent-tabs');
                    tabsContainer.innerHTML = '';
                    
                    continents.forEach(continent => {
                        const tab = document.createElement('div');
                        tab.className = `continent-tab ${continent === this.currentContinent ? 'active' : ''}`;
                        tab.textContent = continentNames[continent];
                        tab.dataset.continent = continent;
                        
                        tab.addEventListener('click', () => {
                            this.currentContinent = continent;
                            this.renderCountries();
                            document.querySelectorAll('.continent-tab').forEach(t => t.classList.remove('active'));
                            tab.classList.add('active');
                        });
                        
                        tabsContainer.appendChild(tab);
                    });
                },
                
                renderCountries: function() {
                    const gridContainer = document.getElementById('countries-grid');
                    gridContainer.innerHTML = '';
                    
                    let filteredCountries = this.worldCapitals;
                    
                    // تصفية حسب القارة
                    if (this.currentContinent !== 'all') {
                        filteredCountries = filteredCountries.filter(country => country.continent === this.currentContinent);
                    }
                    
                    // تصفية حسب البحث
                    if (this.searchQuery.trim() !== '') {
                        const query = this.searchQuery.toLowerCase();
                        filteredCountries = filteredCountries.filter(country => 
                            country.country.toLowerCase().includes(query) || 
                            country.name.toLowerCase().includes(query)
                        );
                    }
                    
                    // ترتيب الدول أبجدياً
                    filteredCountries.sort((a, b) => a.country.localeCompare(b.country));
                    
                    // عرض الدول
                    filteredCountries.forEach(country => {
                        const isOccupied = country.owner !== null;
                        const countryElement = document.createElement('div');
                        countryElement.className = `country-option ${isOccupied ? 'unavailable' : ''} ${this.selectedCountry === country.countryCode ? 'selected' : ''}`;
                        
                        if (!isOccupied) {
                            countryElement.addEventListener('click', () => {
                                this.selectCountry(country.countryCode);
                            });
                        }
                        
                        let ownerInfo = '';
                        if (isOccupied) {
                            ownerInfo = `<div class="country-owner">${country.owner}</div>`;
                        }
                        
                        countryElement.innerHTML = `
                            <img src="https://flagcdn.com/w40/${country.countryCode}.png" alt="${country.country}" class="country-flag" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"60\" height=\"40\" viewBox=\"0 0 60 40\"><rect width=\"60\" height=\"40\" fill=\"%2334495e\"/><text x=\"30\" y=\"20\" font-family=\"Arial\" font-size=\"10\" fill=\"white\" text-anchor=\"middle\" dy=\".3em\">${country.countryCode.toUpperCase()}</text></svg>'">
                            <div class="country-name">${country.country}</div>
                            <div class="country-capital">${country.name}</div>
                            ${ownerInfo}
                        `;
                        
                        gridContainer.appendChild(countryElement);
                    });
                    
                    // تحديث عدد الدول المعروضة
                    this.updateStats();
                },
                
                selectCountry: function(countryCode) {
                    this.selectedCountry = countryCode;
                    this.renderCountries();
                    
                    // عرض رسالة نجاح
                    const country = this.worldCapitals.find(c => c.countryCode === countryCode);
                    if (country) {
                        this.showMessage(`تم اختيار ${country.country} - ${country.name}`, 'success');
                    }
                },
                
                setupEventListeners: function() {
                    // بحث الدول
                    document.getElementById('country-search').addEventListener('input', (e) => {
                        this.searchQuery = e.target.value;
                        this.renderCountries();
                    });
                    
                    // تسجيل الدخول
                    document.getElementById('login-form').addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.handleLogin();
                    });
                },
                
                handleLogin: function() {
                    const playerName = document.getElementById('player-name').value.trim();
                    const playerEmail = document.getElementById('player-email').value.trim();
                    
                    // التحقق من صحة البيانات
                    if (playerName.length < 3) {
                        this.showMessage('اسم اللاعب يجب أن يكون 3 أحرف على الأقل', 'error');
                        return;
                    }
                    
                    if (this.selectedCountry === null) {
                        this.showMessage('يرجى اختيار دولة للبدء', 'error');
                        return;
                    }
                    
                    // التحقق من أن الدولة غير محتلة
                    const selectedCountryData = this.worldCapitals.find(c => c.countryCode === this.selectedCountry);
                    if (!selectedCountryData || selectedCountryData.owner !== null) {
                        this.showMessage('الدولة المختارة محتلة بالفعل، يرجى اختيار دولة أخرى', 'error');
                        return;
                    }
                    
                    // إنشاء لاعب جديد
                    const playerId = 'player_' + Date.now();
                    const newPlayer = {
                        id: playerId,
                        name: playerName,
                        email: playerEmail || null,
                        country: this.selectedCountry,
                        countryName: selectedCountryData.country,
                        capital: selectedCountryData.name,
                        joinedDate: new Date().toISOString(),
                        score: 0,
                        level: 1,
                        resources: {
                            wood: 1000,
                            concrete: 500,
                            iron: 200,
                            oil: selectedCountryData.resources.includes('نفط') ? 100 : 0,
                            silicon: selectedCountryData.resources.includes('سيليكون') ? 50 : 0,
                            uranium: selectedCountryData.resources.includes('يورانيوم') ? 10 : 0,
                            gold: selectedCountryData.resources.includes('ذهب') ? 100 : 0
                        },
                        military: {
                            soldiers: 5000,
                            tanks: 50,
                            aircraft: 10,
                            ships: selectedCountryData.continent === 'أوقيانوسيا' ? 5 : 2
                        },
                        economy: selectedCountryData.economyPower,
                        militaryPower: selectedCountryData.militaryPower,
                        territory: [this.selectedCountry],
                        flag: `https://flagcdn.com/w320/${this.selectedCountry}.png`
                    };
                    
                    // حفظ اللاعب
                    this.players[playerId] = newPlayer;
                    this.savePlayers();
                    
                    // تحديث الدولة كمحتلة
                    selectedCountryData.owner = playerName;
                    selectedCountryData.status = "محتل";
                    
                    // تحديث الإحصائيات
                    this.updateStats();
                    this.renderCountries();
                    
                    // عرض رسالة نجاح
                    this.showMessage(`تم إنشاء حسابك بنجاح! مرحباً ${playerName}، حاكم ${selectedCountryData.country}`, 'success');
                    
                    // إعادة توجيه إلى صفحة اللعبة (محاكاة)
                    setTimeout(() => {
                        this.showLoading('جاري الدخول إلى اللعبة...');
                        
                        // إنشاء صفحة اللعبة
                        setTimeout(() => {
                            this.hideLoading();
                            this.launchGame(newPlayer, selectedCountryData);
                        }, 2000);
                    }, 1500);
                },
                
                launchGame: function(player, country) {
                    // إنشاء صفحة "قريبًا" مع تأثير ضبابي
                    const soonHTML = `
                        <!DOCTYPE html>
                        <html lang="ar" dir="rtl">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>${country.country} - استراتيجية العالم</title>
                            <style>
                                * {
                                    margin: 0;
                                    padding: 0;
                                    box-sizing: border-box;
                                }
                                
                                body {
                                    font-family: 'Cairo', sans-serif;
                                    background: linear-gradient(135deg, #0f1519 0%, #1a2632 100%);
                                    min-height: 100vh;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: center;
                                    overflow: hidden;
                                    position: relative;
                                    color: white;
                                }
                                
                                /* تأثير الضباب */
                                .blur-overlay {
                                    position: fixed;
                                    top: 0;
                                    left: 0;
                                    width: 100%;
                                    height: 100%;
                                    background: rgba(15, 21, 25, 0.7);
                                    backdrop-filter: blur(15px);
                                    z-index: 1;
                                }
                                
                                .soon-container {
                                    position: relative;
                                    z-index: 2;
                                    text-align: center;
                                    padding: 40px;
                                    max-width: 800px;
                                }
                                
                                .soon-title {
                                    font-size: 72px;
                                    font-weight: 900;
                                    color: #f1c40f;
                                    margin-bottom: 30px;
                                    text-shadow: 0 5px 20px rgba(0,0,0,0.5);
                                    animation: pulse 2s infinite;
                                }
                                
                                .soon-subtitle {
                                    font-size: 24px;
                                    color: #bdc3c7;
                                    margin-bottom: 50px;
                                    line-height: 1.6;
                                }
                                
                                .player-info {
                                    background: rgba(44, 62, 80, 0.8);
                                    border-radius: 15px;
                                    padding: 30px;
                                    margin: 30px 0;
                                    border: 2px solid #3498db;
                                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                                }
                                
                                .player-name {
                                    font-size: 32px;
                                    color: #2ecc71;
                                    margin-bottom: 10px;
                                }
                                
                                .player-country {
                                    font-size: 20px;
                                    color: #f1c40f;
                                }
                                
                                .countdown {
                                    font-size: 36px;
                                    color: #3498db;
                                    margin: 40px 0;
                                    font-weight: bold;
                                }
                                
                                .back-btn {
                                    display: inline-block;
                                    background: #e74c3c;
                                    color: white;
                                    padding: 15px 40px;
                                    border-radius: 10px;
                                    text-decoration: none;
                                    font-size: 18px;
                                    font-weight: bold;
                                    margin-top: 30px;
                                    transition: all 0.3s;
                                    border: none;
                                    cursor: pointer;
                                    font-family: 'Cairo', sans-serif;
                                }
                                
                                .back-btn:hover {
                                    background: #c0392b;
                                    transform: translateY(-3px);
                                    box-shadow: 0 7px 20px rgba(231, 76, 60, 0.4);
                                }
                                
                                .flag-large {
                                    width: 200px;
                                    height: 120px;
                                    border-radius: 10px;
                                    border: 3px solid #f1c40f;
                                    margin: 0 auto 30px;
                                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                                    object-fit: cover;
                                }
                                
                                @keyframes pulse {
                                    0% { transform: scale(1); }
                                    50% { transform: scale(1.05); }
                                    100% { transform: scale(1); }
                                }
                                
                                @keyframes fadeIn {
                                    from { opacity: 0; transform: translateY(20px); }
                                    to { opacity: 1; transform: translateY(0); }
                                }
                                
                                .soon-container > * {
                                    animation: fadeIn 1s ease-out;
                                }
                                
                                .message {
                                    font-size: 20px;
                                    color: #95a5a6;
                                    margin-top: 20px;
                                    line-height: 1.6;
                                    max-width: 600px;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="blur-overlay"></div>
                            <div class="soon-container">
                                <img src="https://flagcdn.com/w320/${country.countryCode}.png" alt="${country.country}" class="flag-large">
                                <h1 class="soon-title">SOON</h1>
                                <h2 class="soon-subtitle">لعبة استراتيجية العالم قريباً</h2>
                                
                                <div class="player-info">
                                    <div class="player-name">${player.name}</div>
                                    <div class="player-country">حاكم ${country.country}</div>
                                    <div class="countdown">قيد التطوير</div>
                                </div>
                                
                                <p class="message">
                                    نعمل حالياً على تطوير تجربة اللعبة الكاملة. سيتم إطلاق اللعبة قريباً مع ميزات استراتيجية متقدمة، خريطة تفاعلية، ومعارك حقيقية.
                                </p>
                                
                                <button class="back-btn" onclick="window.close()">
                                    <i class="fas fa-arrow-right"></i> العودة إلى الاختيار
                                </button>
                            </div>
                        </body>
                        </html>
                    `;
                    
                    // فتح صفحة "قريبًا" في نافذة جديدة
                    const gameWindow = window.open();
                    gameWindow.document.write(soonHTML);
                    gameWindow.document.close();
                },
                
                savePlayers: function() {
                    try {
                        localStorage.setItem('worldStrategyPlayers', JSON.stringify(this.players));
                        return true;
                    } catch (error) {
                        console.error('خطأ في حفظ بيانات اللاعبين:', error);
                        return false;
                    }
                },
                
                showMessage: function(message, type) {
                    const errorDiv = document.getElementById('error-message');
                    const successDiv = document.getElementById('success-message');
                    
                    if (type === 'error') {
                        errorDiv.textContent = message;
                        errorDiv.style.display = 'block';
                        successDiv.style.display = 'none';
                        
                        // إخفاء الرسالة بعد 5 ثواني
                        setTimeout(() => {
                            errorDiv.style.display = 'none';
                        }, 5000);
                    } else {
                        successDiv.textContent = message;
                        successDiv.style.display = 'block';
                        errorDiv.style.display = 'none';
                        
                        // إخفاء الرسالة بعد 5 ثواني
                        setTimeout(() => {
                            successDiv.style.display = 'none';
                        }, 5000);
                    }
                },
                
                showLoading: function(message = 'جاري التحميل...') {
                    const overlay = document.getElementById('loading-overlay');
                    const text = overlay.querySelector('.loading-text');
                    text.textContent = message;
                    overlay.classList.add('active');
                },
                
                hideLoading: function() {
                    const overlay = document.getElementById('loading-overlay');
                    overlay.classList.remove('active');
                }
            };
            
            // تهيئة اللعبة
            window.GameManager = GameManager;
            GameManager.init();
        });
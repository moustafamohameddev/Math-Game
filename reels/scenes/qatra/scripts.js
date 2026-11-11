/* سكريبتات فيديوهات «العدّاد» (نفس نوع مئة قطرة): كل عنصر = فيديو.
 * count   : عدد المرات (33 = فيديو ~46 ثانية، 100 = ~113 ثانية)
 * palette : gold | emerald | rose | dusk   (لون العنوان)
 * story   : الرسمة — palms (نخيل وليل) | lanterns (فوانيس) | roses (ورد وأنوار) | tree (شجرة وفجر) | من غيرها = الصحرا والبِركة
 * miles   : 4 محطات (عند ربع/نص/ثلاث أرباع/آخر العدّ) — اسم المحطة + الآية
 * راجع نص كل آية قبل النشر. */
window.QATRA_HANDLE = 'mostafamohamed6003';
window.QATRA_SCRIPTS = [
  { id: 'istighfar-100', count: 100, palette: 'gold', original: true },   // النص الأصلي

  { id: 'tasbih-33', count: 33, palette: 'emerald', story: 'palms', brandAr: 'ثلاث وثلاثون', brandEn: '33 Drops · SubhanAllah',
    intro1: ['قبل أن', 'تُكمل', 'التمرير...'], introBig: '33 تســبيحة', introEn: '33 × SubhanAllah', introSub: 'One drop for each — say it with us.',
    title: 'سُبْحَــانَ اللهِ', titleEn: 'SubhanAllah', titleSub: 'Glory be to Allah',
    miles: [
      { ar: 'الغرس', en: 'Planting', v: 'وَسَبِّحْ بِحَمْدِ', gold: 'رَبِّكَ', t: '“And glorify the praise of your Lord.”', ref: '— Qaf 50:39 —' },
      { ar: 'النخيل', en: 'Palms', v: 'فَسَبِّحْ بِاسْمِ رَبِّكَ', gold: 'الْعَظِيمِ', t: '“So glorify the name of your Lord, the Most Great.”', ref: '— Al-Waqi‘ah 56:74 —' },
      { ar: 'الليل', en: 'Night', v: 'وَسَبِّحُوهُ بُكْرَةً', gold: 'وَأَصِيلًا', t: '“And glorify Him morning and evening.”', ref: '— Al-Ahzab 33:42 —' },
      { ar: 'النور', en: 'Light', v: 'سَبِّحِ اسْمَ رَبِّكَ', gold: 'الْأَعْلَى', t: '“Glorify the name of your Lord, the Most High.”', ref: '— Al-A‘la 87:1 —' },
    ],
    endBig: '33 تسبيحة', endEn: '33 tasbih', endText: 'Keep your tongue moist with the remembrance of Allah.', endRef: '— Tirmidhi 3375 —' },

  { id: 'hamd-33', count: 33, palette: 'rose', story: 'lanterns', brandAr: 'قطرات الحمد', brandEn: '33 Drops · Alhamdulillah',
    intro1: ['قبل أن', 'تُكمل', 'التمرير...'], introBig: '33 حَمْــدًا', introEn: '33 × Alhamdulillah', introSub: 'One drop for each — say it with us.',
    title: 'الْحَــمْدُ لِلَّهِ', titleEn: 'Alhamdulillah', titleSub: 'All praise is for Allah',
    miles: [
      { ar: 'النور', en: 'Light', v: 'الْحَمْدُ لِلَّهِ رَبِّ', gold: 'الْعَالَمِينَ', t: '“All praise is for Allah, Lord of the worlds.”', ref: '— Al-Fatihah 1:2 —' },
      { ar: 'الزيادة', en: 'Increase', v: 'لَئِن شَكَرْتُمْ', gold: 'لَأَزِيدَنَّكُمْ', t: '“If you are grateful, I will surely increase you.”', ref: '— Ibrahim 14:7 —' },
      { ar: 'الشكر', en: 'Gratitude', v: 'وَقُلِ', gold: 'الْحَمْدُ لِلَّهِ', t: '“And say: All praise is for Allah.”', ref: '— Al-Isra 17:111 —' },
      { ar: 'الرضا', en: 'Contentment', v: 'وَآخِرُ دَعْوَاهُمْ أَنِ الْحَمْدُ لِلَّهِ رَبِّ', gold: 'الْعَالَمِينَ', t: '“Their final call: All praise is for Allah, Lord of the worlds.”', ref: '— Yunus 10:10 —' },
    ],
    endBig: '33 حمدًا', endEn: '33 times', endText: 'Keep your tongue moist with the remembrance of Allah.', endRef: '— Tirmidhi 3375 —' },

  { id: 'salawat-50', count: 50, palette: 'dusk', story: 'roses', brandAr: 'خمسون صلاة', brandEn: '50 Drops · Salawat',
    intro1: ['قبل أن', 'تُكمل', 'التمرير...'], introBig: '50 صــلاة', introEn: '50 × Salawat', introSub: 'One drop for each — say it with us.',
    title: 'اللَّهُمَّ صَــلِّ عَلَى مُحَمَّد', titleEn: 'Allahumma salli ‘ala Muhammad', titleSub: 'O Allah, send blessings upon Muhammad',
    miles: [
      { ar: 'الصلاة', en: 'Blessing', v: 'إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى', gold: 'النَّبِيِّ', t: '“Indeed, Allah and His angels send blessings upon the Prophet.”', ref: '— Al-Ahzab 33:56 —' },
      { ar: 'الورد', en: 'Roses', v: 'يَا أَيُّهَا الَّذِينَ آمَنُوا', gold: 'صَلُّوا عَلَيْهِ', t: '“O you who believe, send blessings upon him.”', ref: '— Al-Ahzab 33:56 —' },
      { ar: 'السلام', en: 'Peace', v: 'وَسَلِّمُوا', gold: 'تَسْلِيمًا', t: '“…and greet him with peace.”', ref: '— Al-Ahzab 33:56 —' },
      { ar: 'الرحمة', en: 'Mercy', v: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً', gold: 'لِّلْعَالَمِينَ', t: '“We sent you only as a mercy to the worlds.”', ref: '— Al-Anbiya 21:107 —' },
    ],
    endBig: '50 صلاة', endEn: '50 salawat', endText: 'Send blessings upon the Prophet — peace be upon him.', endRef: '— Al-Ahzab 33:56 —' },

  { id: 'tahlil-33', count: 33, palette: 'gold', story: 'tree', brandAr: 'قطرات التوحيد', brandEn: '33 Drops · La ilaha illa Allah',
    intro1: ['قبل أن', 'تُكمل', 'التمرير...'], introBig: '33 تهليــلة', introEn: '33 × La ilaha illa Allah', introSub: 'One drop for each — say it with us.',
    title: 'لَا إِلَــهَ إِلَّا الله', titleEn: 'La ilaha illa Allah', titleSub: 'There is no god but Allah',
    miles: [
      { ar: 'البذرة', en: 'Seed', v: 'فَاعْلَمْ أَنَّهُ لَا إِلَٰهَ إِلَّا', gold: 'اللَّهُ', t: '“So know that there is no god but Allah.”', ref: '— Muhammad 47:19 —' },
      { ar: 'الجذر', en: 'Root', v: 'وَإِلَٰهُكُمْ إِلَٰهٌ', gold: 'وَاحِدٌ', t: '“And your God is one God.”', ref: '— Al-Baqarah 2:163 —' },
      { ar: 'الفروع', en: 'Branches', v: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ', gold: 'الْقَيُّومُ', t: '“Allah — there is no god but Him, the Ever-Living, the Sustainer.”', ref: '— Al-Baqarah 2:255 —' },
      { ar: 'اليقين', en: 'Certainty', v: 'قُلْ هُوَ اللَّهُ', gold: 'أَحَدٌ', t: '“Say: He is Allah, the One.”', ref: '— Al-Ikhlas 112:1 —' },
    ],
    endBig: '33 تهليلة', endEn: '33 times', endText: 'Keep your tongue moist with the remembrance of Allah.', endRef: '— Tirmidhi 3375 —' },
];

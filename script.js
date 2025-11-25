const tunnels = {
    WHC: {
        name: "西區海底隧道",
        nameEn: "Western Harbour Crossing",
        abbr: "西",
        abbrEn: "W",
        className: "whc"
    },
    CHT: {
        name: "紅磡海底隧道",
        nameEn: "Cross Harbour Tunnel",
        abbr: "紅",
        abbrEn: "C",
        className: "cht"
    },
    EHC: {
        name: "東區海底隧道",
        nameEn: "Eastern Harbour Crossing",
        abbr: "東",
        abbrEn: "E",
        className: "ehc"
    },
    TLT: {
        name: "大欖隧道",
        nameEn: "Tai Lam Tunnel",
        abbr: "大",
        abbrEn: "T",
        className: "tlt"
    }
};

const translations = {
    'zh-HK': {
        title: '香港隧道費',
        scheduleTitle: '收費時間表',
        holidayLabel: '星期日 / 公眾假期',
        selectedTimePrefix: '選擇時間:',
        holidaySuffix: '(星期日 / 公眾假期)',
        weekdaySuffix: '(平日)',
        showMore: '顯示更多',
        peak: '繁忙時段',
        normal: '一般時段',
        offPeak: '非繁忙時段',
        transition: '過渡時段',
        fixed: '固定收費',
        timelineHeader: ['西', '紅', '東', '大']
    },
    'en-US': {
        title: 'HK Tunnel Tolls',
        scheduleTitle: 'Toll Schedule',
        holidayLabel: 'Sunday / Public Holiday',
        selectedTimePrefix: 'Time:',
        holidaySuffix: '(Sun / Holiday)',
        weekdaySuffix: '(Weekday)',
        showMore: 'Show More',
        peak: 'Peak',
        normal: 'Normal',
        offPeak: 'Off-peak',
        transition: 'Transition',
        fixed: 'Fixed',
        timelineHeader: ['W', 'C', 'E', 'T']
    }
};

let currentLang = 'zh-HK';

// Helper to convert "HH:MM" to minutes from midnight
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

// Helper to convert minutes from midnight to "HH:MM"
function minutesToTime(minutes) {
    // Handle overflow (next day)
    minutes = minutes % 1440;
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
}

function getTollSchedule(tunnelKey, isHoliday) {
    // Harbour Crossings (WHC, CHT, EHC)
    if (['WHC', 'CHT', 'EHC'].includes(tunnelKey)) {
        const isWHC = tunnelKey === 'WHC';
        const peakPrice = isWHC ? 60 : 40;
        const normalPrice = 30;
        const offPeakPrice = 20;
        
        // Sunday / Holiday Schedule (Same for all 3)
        if (isHoliday) {
            return [
                { start: 0, end: timeToMinutes("10:10"), type: 'off-peak', price: 20 },
                { start: timeToMinutes("10:11"), end: timeToMinutes("10:14"), type: 'transition', startPrice: 21, endPrice: 23, interval: 2, change: 2 }, 
                { start: timeToMinutes("10:15"), end: timeToMinutes("19:14"), type: 'normal', price: 25 },
                { start: timeToMinutes("19:15"), end: timeToMinutes("19:18"), type: 'transition', startPrice: 23, endPrice: 21, interval: 2, change: -2 },
                { start: timeToMinutes("19:19"), end: 1439, type: 'off-peak', price: 20 }
            ];
        } 
        // Weekday Schedule (Different for WHC vs CHT/EHC)
        else {
            if (isWHC) {
                return [
                    { start: 0, end: timeToMinutes("07:29"), type: 'off-peak', price: offPeakPrice },
                    { start: timeToMinutes("07:30"), end: timeToMinutes("08:07"), type: 'transition', startPrice: 22, endPrice: 58, interval: 2, change: 2 },
                    { start: timeToMinutes("08:08"), end: timeToMinutes("10:14"), type: 'peak', price: peakPrice },
                    { start: timeToMinutes("10:15"), end: timeToMinutes("10:42"), type: 'transition', startPrice: 58, endPrice: 32, interval: 2, change: -2 },
                    { start: timeToMinutes("10:43"), end: timeToMinutes("16:29"), type: 'normal', price: normalPrice },
                    { start: timeToMinutes("16:30"), end: timeToMinutes("16:57"), type: 'transition', startPrice: 32, endPrice: 58, interval: 2, change: 2 },
                    { start: timeToMinutes("16:58"), end: timeToMinutes("18:59"), type: 'peak', price: peakPrice },
                    { start: timeToMinutes("19:00"), end: timeToMinutes("19:37"), type: 'transition', startPrice: 58, endPrice: 22, interval: 2, change: -2 },
                    { start: timeToMinutes("19:38"), end: 1439, type: 'off-peak', price: offPeakPrice }
                ];
            } else {
                // CHT & EHC
                return [
                    { start: 0, end: timeToMinutes("07:29"), type: 'off-peak', price: offPeakPrice },
                    { start: timeToMinutes("07:30"), end: timeToMinutes("07:47"), type: 'transition', startPrice: 22, endPrice: 38, interval: 2, change: 2 },
                    { start: timeToMinutes("07:48"), end: timeToMinutes("10:14"), type: 'peak', price: peakPrice },
                    { start: timeToMinutes("10:15"), end: timeToMinutes("10:22"), type: 'transition', startPrice: 38, endPrice: 32, interval: 2, change: -2 },
                    { start: timeToMinutes("10:23"), end: timeToMinutes("16:29"), type: 'normal', price: normalPrice },
                    { start: timeToMinutes("16:30"), end: timeToMinutes("16:37"), type: 'transition', startPrice: 32, endPrice: 38, interval: 2, change: 2 },
                    { start: timeToMinutes("16:38"), end: timeToMinutes("18:59"), type: 'peak', price: peakPrice },
                    { start: timeToMinutes("19:00"), end: timeToMinutes("19:17"), type: 'transition', startPrice: 38, endPrice: 22, interval: 2, change: -2 },
                    { start: timeToMinutes("19:18"), end: 1439, type: 'off-peak', price: offPeakPrice }
                ];
            }
        }
    }
    
    // Tai Lam Tunnel (TLT)
    if (tunnelKey === 'TLT') {
        if (isHoliday) {
            return [
                { start: 0, end: 1439, type: 'fixed', price: 18 }
            ];
        } else {
            return [
                { start: 0, end: timeToMinutes("07:14"), type: 'off-peak', price: 18 },
                { start: timeToMinutes("07:15"), end: timeToMinutes("07:40"), type: 'transition', startPrice: 19, endPrice: 43, interval: 2, change: 2 },
                { start: timeToMinutes("07:41"), end: timeToMinutes("09:44"), type: 'peak', price: 45 },
                { start: timeToMinutes("09:45"), end: timeToMinutes("09:58"), type: 'transition', startPrice: 43, endPrice: 31, interval: 2, change: -2 },
                { start: timeToMinutes("09:59"), end: timeToMinutes("17:14"), type: 'normal', price: 30 },
                { start: timeToMinutes("17:15"), end: timeToMinutes("17:28"), type: 'transition', startPrice: 31, endPrice: 43, interval: 2, change: 2 },
                { start: timeToMinutes("17:29"), end: timeToMinutes("18:59"), type: 'peak', price: 45 },
                { start: timeToMinutes("19:00"), end: timeToMinutes("19:25"), type: 'transition', startPrice: 43, endPrice: 19, interval: 2, change: -2 },
                { start: timeToMinutes("19:26"), end: 1439, type: 'off-peak', price: 18 }
            ];
        }
    }
    return [];
}

function calculatePrice(tunnelKey, minutes, isHoliday) {
    const schedule = getTollSchedule(tunnelKey, isHoliday);
    
    for (const slot of schedule) {
        if (minutes >= slot.start && minutes <= slot.end) {
            if (slot.type === 'transition') {
                const minutesIntoSlot = minutes - slot.start;
                const steps = Math.floor(minutesIntoSlot / slot.interval);
                const price = slot.startPrice + (steps * slot.change);
                // Next change is when the current 2-min step ends
                const nextChange = slot.start + (steps + 1) * slot.interval;
                return { price, type: slot.type, nextChange: nextChange };
            } else {
                return { price: slot.price, type: slot.type, nextChange: slot.end + 1 };
            }
        }
    }
    return { price: 0, type: 'unknown', nextChange: 1440 };
}

function getTypeName(type) {
    const t = translations[currentLang];
    switch(type) {
        case 'peak': return t.peak;
        case 'normal': return t.normal;
        case 'off-peak': return t.offPeak;
        case 'transition': return t.transition;
        case 'fixed': return t.fixed;
        default: return type;
    }
}

function getTunnelColor(key) {
    switch(key) {
        case 'WHC': return '#F57F17';
        case 'CHT': return '#D32F2F';
        case 'EHC': return '#1976D2';
        case 'TLT': return '#388E3C';
        default: return '#8E8E93';
    }
}

// UI Logic
const hourSelect = document.getElementById('hour-select');
const minuteSelect = document.getElementById('minute-select');
const holidayToggle = document.getElementById('holiday-toggle');
const tunnelsContainer = document.getElementById('tunnels-container');
const timelineContainer = document.getElementById('timeline-container');
const selectedTimeDisplay = document.getElementById('selected-time-display');
const langToggle = document.getElementById('lang-toggle');
const appTitle = document.getElementById('app-title');
const scheduleTitle = document.getElementById('schedule-title');
const holidayLabel = document.getElementById('holiday-label');
const timelineHeader = document.getElementById('timeline-header');

// Populate Selectors with Infinite Loop Logic
function populateSelect(selectElement, max) {
    selectElement.innerHTML = '';
    const sets = ['prev', 'curr', 'next'];
    sets.forEach(prefix => {
        for (let i = 0; i < max; i++) {
            const opt = document.createElement('option');
            opt.value = `${prefix}_${i}`;
            opt.text = i.toString().padStart(2, '0');
            selectElement.appendChild(opt);
        }
    });
}

populateSelect(hourSelect, 24);
populateSelect(minuteSelect, 60);

// Set default to now (middle set)
const now = new Date();
hourSelect.value = `curr_${now.getHours()}`;
minuteSelect.value = `curr_${now.getMinutes()}`;

// Check if today is Sunday
if (now.getDay() === 0) {
    holidayToggle.checked = true;
}

function handleInfiniteLoop(selectElement) {
    const value = selectElement.value;
    if (!value.includes('_')) return parseInt(value); // Fallback
    
    const [prefix, numStr] = value.split('_');
    const num = parseInt(numStr);
    
    if (prefix !== 'curr') {
        // Switch back to middle set silently
        selectElement.value = `curr_${num}`;
    }
    return num;
}

function updateStaticText() {
    const t = translations[currentLang];
    appTitle.textContent = t.title;
    scheduleTitle.textContent = t.scheduleTitle;
    holidayLabel.textContent = t.holidayLabel;
    langToggle.textContent = currentLang === 'zh-HK' ? 'EN' : '中';
    
    // Update timeline header
    const headerDivs = timelineHeader.querySelectorAll('div');
    // headerDivs[0] and [1] are empty spacers
    headerDivs[2].textContent = t.timelineHeader[0];
    headerDivs[3].textContent = t.timelineHeader[1];
    headerDivs[4].textContent = t.timelineHeader[2];
    headerDivs[5].textContent = t.timelineHeader[3];
}

function updateUI() {
    const h = handleInfiniteLoop(hourSelect);
    const m = handleInfiniteLoop(minuteSelect);
    const isHoliday = holidayToggle.checked;
    const t = translations[currentLang];
    
    const currentMinutes = h * 60 + m;
    const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    
    selectedTimeDisplay.textContent = `${t.selectedTimePrefix} ${timeStr} ${isHoliday ? t.holidaySuffix : t.weekdaySuffix}`;

    tunnelsContainer.innerHTML = '';
    timelineContainer.innerHTML = '';

    // 1. Render Tunnel Cards
    for (const key in tunnels) {
        const tunnel = tunnels[key];
        const { price, type } = calculatePrice(key, currentMinutes, isHoliday);
        
        const card = document.createElement('div');
        card.className = `tunnel-card ${tunnel.className}`;
        
        let statusClass = 'status-normal';
        if (type === 'peak') statusClass = 'status-peak';
        if (type === 'off-peak') statusClass = 'status-off-peak';
        if (type === 'transition') statusClass = 'status-transition';
        if (type === 'fixed') statusClass = 'status-fixed';

        const tunnelName = currentLang === 'zh-HK' ? tunnel.name : tunnel.nameEn;

        card.innerHTML = `
            <div>
                <div class="tunnel-name">${tunnelName}</div>
                <div class="tunnel-price">$${price}</div>
                <div class="tunnel-status ${statusClass}">${getTypeName(type)}</div>
            </div>
        `;
        tunnelsContainer.appendChild(card);
    }

    // 2. Render Timeline (Range based)
    // We want to show ranges of stable prices.
    // Start from currentMinutes.
    // Find the minimum nextChange across all tunnels.
    // Display range: current -> minNextChange.
    // Then advance current to minNextChange and repeat.
    
    let simMinutes = currentMinutes;
    const maxLookahead = 1440; // Look ahead 24 hours max (increased to ensure we have enough items)
    const endMinutes = currentMinutes + maxLookahead;
    
    let iterations = 0;
    const maxIterations = 100; // Increased limit to allow for more items
    
    while (simMinutes < endMinutes && iterations < maxIterations) {
        // Determine effective time and holiday status for calculation
        let effectiveMinutes = simMinutes % 1440;
        let effectiveIsHoliday = isHoliday;
        
        // Assumption: If we cross midnight, the next day is a Weekday.
        // This handles Sunday -> Monday (Holiday -> Weekday) correctly.
        // It also handles Weekday -> Weekday correctly.
        // It is inaccurate for Saturday -> Sunday, but acceptable for this simple toggle.
        if (simMinutes >= 1440) {
            effectiveIsHoliday = false;
        }

        // Calculate prices for all tunnels at simMinutes
        let prices = {};
        let nextChangeRelative = 1440; // Default to end of day (relative to 0)
        
        for (const key in tunnels) {
            const res = calculatePrice(key, effectiveMinutes, effectiveIsHoliday);
            prices[key] = res; // Store full result to access type later
            if (res.nextChange < nextChangeRelative) {
                nextChangeRelative = res.nextChange;
            }
        }
        
        // Calculate absolute next change
        let distToChange = nextChangeRelative - effectiveMinutes;
        if (distToChange <= 0) distToChange = 1440 - effectiveMinutes; // Should wrap to next day
        
        let nextChangeAbsolute = simMinutes + distToChange;

        // Check for merge across midnight
        // If the current segment ends at midnight, check if the next day starts with the same prices
        if (nextChangeAbsolute % 1440 === 0 && nextChangeAbsolute < endMinutes) {
            const nextDayMinutes = 0;
            // Assumption: Next day is always weekday (false) for simplicity in this view
            const nextDayIsHoliday = false; 
            
            let canMerge = true;
            let nextDayMinChange = 1440;

            for (const key in tunnels) {
                const nextRes = calculatePrice(key, nextDayMinutes, nextDayIsHoliday);
                const currentRes = prices[key];
                
                if (nextRes.price !== currentRes.price || nextRes.type !== currentRes.type) {
                    canMerge = false;
                    break;
                }
                if (nextRes.nextChange < nextDayMinChange) {
                    nextDayMinChange = nextRes.nextChange;
                }
            }

            if (canMerge) {
                nextChangeAbsolute += nextDayMinChange;
            }
        }
        
        // If nextChange is beyond our lookahead, cap it
        if (nextChangeAbsolute > endMinutes) nextChangeAbsolute = endMinutes;
        
        // If nextChange is same as simMinutes (shouldn't happen if logic is right, but safety)
        if (nextChangeAbsolute <= simMinutes) break;

        const startTimeStr = minutesToTime(simMinutes);
        const endTimeStr = minutesToTime(nextChangeAbsolute);
        
        const item = document.createElement('div');
        item.className = 'timeline-item';
        if (iterations >= 20) {
            item.classList.add('hidden-item');
        }
        
        let pricesHtml = '';
        for (const key in tunnels) {
            // We need the type to determine color
            const { price, type } = prices[key];
            let badgeClass = 'price-normal';
            if (type === 'peak') badgeClass = 'price-peak';
            if (type === 'transition') badgeClass = 'price-transition';
            if (type === 'off-peak') badgeClass = 'price-off-peak';
            if (type === 'fixed') badgeClass = 'price-fixed';
            
            pricesHtml += `<div class="timeline-price-col"><span class="price-badge ${badgeClass}">$${price}</span></div>`;
        }

        item.innerHTML = `
            <div class="timeline-icon">🕒</div>
            <span class="timeline-time">${startTimeStr} - ${endTimeStr}</span>
            ${pricesHtml}
        `;
        timelineContainer.appendChild(item);
        
        simMinutes = nextChangeAbsolute;
        iterations++;
    }

    if (iterations > 20) {
        const btn = document.createElement('button');
        btn.className = 'show-more-btn';
        btn.textContent = t.showMore;
        btn.onclick = function() {
            const hiddenItems = timelineContainer.querySelectorAll('.hidden-item');
            hiddenItems.forEach(item => item.classList.remove('hidden-item'));
            btn.remove();
        };
        timelineContainer.appendChild(btn);
    }
}

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'zh-HK' ? 'en-US' : 'zh-HK';
    updateStaticText();
    updateUI();
});

hourSelect.addEventListener('change', updateUI);
minuteSelect.addEventListener('change', updateUI);
holidayToggle.addEventListener('change', updateUI);

// Initial render
updateStaticText();
updateUI();

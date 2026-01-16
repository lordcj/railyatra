import { Train, Station } from '@/lib/db/types';

/**
 * Generates a unique, SEO-friendly description for a train.
 */
export function generateTrainDescription(train: Train): string {
    const isPremium = ['Vande Bharat', 'Rajdhani', 'Shatabdi', 'Duronto', 'Tejas'].includes(train.type);
    const speed = parseFloat(train.distance) / parseFloat(train.duration); // Crude valid check
    const isFast = speed > 55 || train.type === 'Superfast' || isPremium;

    let desc = `The ${train.number} ${train.name} is a ${isFast ? 'superfast' : 'popular'} ${train.type} train `;
    desc += `operated by Indian Railways, connecting ${train.source} (${train.sourceCode}) to ${train.destination} (${train.destinationCode}). `;

    desc += `It covers a total distance of ${train.distance} in approximately ${train.duration}, `;
    desc += `maintaining an average speed of ${Math.round(parseFloat(train.distance.replace(' km', '')) / (parseInt(train.duration) || 12))} km/hr. `;

    desc += `The train halts at ${train.stops} stations along the route`;
    if (train.majorStops && train.majorStops.length > 0) {
        desc += `, including major stops like ${train.majorStops.slice(0, 3).join(', ')}. `;
    } else {
        desc += '. ';
    }

    if (isPremium) {
        desc += `As a premium ${train.type} service, it offers enhanced comfort and onboard catering. `;
    }

    desc += `Passengers can book tickets in ${train.classes.join(', ')} classes. `;
    desc += `The train runs ${train.frequency.toLowerCase()} on ${train.runningDays.join(', ')}.`;

    return desc;
}

/**
 * Generates dynamic FAQs for a train to target "People Also Ask" queries.
 */
export function generateTrainFAQs(train: Train) {
    return [
        {
            question: `What is the train number of ${train.name}?`,
            answer: `The train number of ${train.name} is ${train.number}. It runs from ${train.source} to ${train.destination}.`
        },
        {
            question: `What is the schedule of ${train.number} ${train.name}?`,
            answer: `${train.name} departs from ${train.sourceCode} at ${train.departureTime} and arrives at ${train.destinationCode} at ${train.arrivalTime}. The total journey duration is ${train.duration}.`
        },
        {
            question: `Does ${train.number} run daily?`,
            answer: `${train.name} runs on ${train.runningDays.join(', ')}. It is a ${train.frequency} service.`
        },
        {
            question: `What classes are available in ${train.name}?`,
            answer: `You can book tickets in ${train.classes.join(', ')} classes on the ${train.name}.`
        },
        {
            question: `How can I check the live status of ${train.number}?`,
            answer: `You can check the real-time live running status, spot your train location, and get platform updates for ${train.number} ${train.name} right here on RailYatra.`
        }
    ];
}

/**
 * Generates a unique, SEO-friendly description for a station.
 */
export function generateStationDescription(station: Station): string {
    let desc = `${station.fullName} (Station Code: ${station.code}) is a major railway station located in ${station.state}, India. `;
    desc += `Operated by the ${station.zone} zone of Indian Railways, it is a key transport hub in the region. `;

    desc += `The station has ${station.platforms} platforms handling numerous daily train arrivals and departures. `;

    if (station.category === 'A1' || station.category === 'A') {
        desc += `Classified as a Category ${station.category} station, it offers modern amenities including waiting rooms, retiring rooms, and food plazas. `;
    }

    if (station.connectivity && station.connectivity.length > 0) {
        desc += `It provides seamless connectivity via ${station.connectivity.join(', ')}, making it accessible for travelers. `;
    }

    desc += `Travelers can check live train status, PNR status, and seat availability for trains originating from or passing through ${station.name} on RailYatra.`;

    return desc;
}

/**
 * Generates dynamic FAQs for a station.
 */
export function generateStationFAQs(station: Station) {
    return [
        {
            question: `What is the station code for ${station.name}?`,
            answer: `The station code for ${station.name} is ${station.code}. Its full name is ${station.fullName}.`
        },
        {
            question: `How many platforms are there in ${station.name}?`,
            answer: `${station.fullName} has ${station.platforms} platforms.`
        },
        {
            question: `Which railway zone is ${station.name} in?`,
            answer: `${station.name} falls under the ${station.zone} zone of Indian Railways.`
        },
        {
            question: `How to check trains from ${station.name}?`,
            answer: `You can view the list of all trains arriving and departing from ${station.name}, along with their complete schedule and live status on RailYatra.`
        }
    ];
}

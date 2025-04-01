import { Category } from '../types/game';

// Helper function to get all locations from all categories
const getAllLocations = (categories: Category[]) => {
  return categories.flatMap(category => 
    category.locations.map(location => ({
      name: `${location.name} (${category.name})`
    }))
  );
};

export const categories: Category[] = [
  {
    name: "Roulette",
    locations: getAllLocations([
      {
        name: "Restaurant",
        locations: [
          { name: "Italian Restaurant" },
          { name: "Fast Food Joint" },
          { name: "Sushi Bar" },
          { name: "Pizza Place" },
          { name: "Mexican Restaurant" },
          { name: "Steakhouse" },
          { name: "Café" },
          { name: "Food Court" },
          { name: "Diner" },
          { name: "Food Truck" },
          { name: "Thai Restaurant" },
          { name: "Indian Restaurant" },
          { name: "Greek Restaurant" },
          { name: "Chinese Restaurant" },
          { name: "Korean BBQ" },
          { name: "Vietnamese Restaurant" },
          { name: "Brazilian Steakhouse" },
          { name: "Seafood Restaurant" },
          { name: "Vegetarian Restaurant" },
          { name: "Halal Restaurant" }
        ]
      },
      {
        name: "Hospital",
        locations: [
          { name: "Emergency Room" },
          { name: "Operating Room" },
          { name: "Pediatric Ward" },
          { name: "Intensive Care Unit" },
          { name: "Laboratory" },
          { name: "Pharmacy" },
          { name: "Maternity Ward" },
          { name: "Rehabilitation Center" },
          { name: "Mental Health Ward" },
          { name: "Radiology Department" },
          { name: "Dental Clinic" },
          { name: "Blood Bank" },
          { name: "Burn Unit" },
          { name: "Cardiology Department" },
          { name: "Oncology Ward" },
          { name: "Orthopedic Department" },
          { name: "Neurology Department" },
          { name: "Physical Therapy" },
          { name: "Ambulance Service" },
          { name: "Medical Research Center" }
        ]
      },
      {
        name: "Hotel",
        locations: [
          { name: "Luxury Hotel" },
          { name: "Beach Resort" },
          { name: "Mountain Lodge" },
          { name: "City Hotel" },
          { name: "Spa Resort" },
          { name: "Casino Hotel" },
          { name: "Boutique Hotel" },
          { name: "Hostel" },
          { name: "Motel" },
          { name: "Bed and Breakfast" },
          { name: "Heritage Hotel" },
          { name: "Safari Lodge" },
          { name: "Ice Hotel" },
          { name: "Treehouse Hotel" },
          { name: "Underwater Hotel" },
          { name: "Desert Camp" },
          { name: "Floating Hotel" },
          { name: "Historic Inn" },
          { name: "Eco Resort" },
          { name: "Luxury Villa" }
        ]
      },
      {
        name: "School",
        locations: [
          { name: "Elementary School" },
          { name: "High School" },
          { name: "University" },
          { name: "Art School" },
          { name: "Music School" },
          { name: "Sports Academy" },
          { name: "Culinary School" },
          { name: "Military Academy" },
          { name: "Language School" },
          { name: "Dance Studio" },
          { name: "Medical School" },
          { name: "Law School" },
          { name: "Engineering College" },
          { name: "Business School" },
          { name: "Film School" },
          { name: "Theater School" },
          { name: "Architecture School" },
          { name: "Veterinary School" },
          { name: "Agricultural College" },
          { name: "Maritime Academy" }
        ]
      },
      {
        name: "Transport",
        locations: [
          { name: "Airport" },
          { name: "Train Station" },
          { name: "Bus Terminal" },
          { name: "Subway Station" },
          { name: "Cruise Ship" },
          { name: "Ferry Terminal" },
          { name: "Space Station" },
          { name: "Heliport" },
          { name: "Cable Car Station" },
          { name: "Bicycle Shop" },
          { name: "Car Dealership" },
          { name: "Gas Station" },
          { name: "Auto Repair Shop" },
          { name: "Boat Marina" },
          { name: "Horse Stable" },
          { name: "Skateboard Park" },
          { name: "Segway Rental" },
          { name: "Hot Air Balloon Launch" },
          { name: "Hang Gliding Center" },
          { name: "Parachuting Center" }
        ]
      },
      {
        name: "Entertainment",
        locations: [
          { name: "Movie Theater" },
          { name: "Concert Hall" },
          { name: "Amusement Park" },
          { name: "Zoo" },
          { name: "Aquarium" },
          { name: "Circus" },
          { name: "Comedy Club" },
          { name: "Bowling Alley" },
          { name: "Arcade" },
          { name: "Escape Room" },
          { name: "Opera House" },
          { name: "Art Gallery" },
          { name: "Museum" },
          { name: "Theater" },
          { name: "Karaoke Bar" },
          { name: "Casino" },
          { name: "Theme Park" },
          { name: "Water Park" },
          { name: "Virtual Reality Center" },
          { name: "Laser Tag Arena" }
        ]
      },
      {
        name: "MIT",
        locations: [
          { name: "Hayden Library" },
          { name: "Barker Library" },
          { name: "McCormick Hall" },
          { name: "Maseeh Hall" },
          { name: "W11" },
          { name: "Lobdell" },
          { name: "Walker Memorial" },
          { name: "Stata" },
          { name: "Killian Court" },
          { name: "Great Dome" },
          { name: "Sloan" },
          { name: "Kresge Auditorium" },
          { name: "Lobby 7" },
          { name: "Lobby 10" },
          { name: "Banana Lounge" },
          { name: "MSA Lounge" },
          { name: "Z Center" },
          { name: "Alumni Wang Gym" }
        ]
      }
    ])
  },
  {
    name: "Restaurant",
    locations: [
      { name: "Italian Restaurant" },
      { name: "Fast Food Joint" },
      { name: "Sushi Bar" },
      { name: "Pizza Place" },
      { name: "Mexican Restaurant" },
      { name: "Steakhouse" },
      { name: "Café" },
      { name: "Food Court" },
      { name: "Diner" },
      { name: "Food Truck" },
      { name: "Thai Restaurant" },
      { name: "Indian Restaurant" },
      { name: "Greek Restaurant" },
      { name: "Chinese Restaurant" },
      { name: "Korean BBQ" },
      { name: "Vietnamese Restaurant" },
      { name: "Brazilian Steakhouse" },
      { name: "Seafood Restaurant" },
      { name: "Vegetarian Restaurant" },
      { name: "Halal Restaurant" }
    ]
  },
  {
    name: "Hospital",
    locations: [
      { name: "Emergency Room" },
      { name: "Operating Room" },
      { name: "Pediatric Ward" },
      { name: "Intensive Care Unit" },
      { name: "Laboratory" },
      { name: "Pharmacy" },
      { name: "Maternity Ward" },
      { name: "Rehabilitation Center" },
      { name: "Mental Health Ward" },
      { name: "Radiology Department" },
      { name: "Dental Clinic" },
      { name: "Blood Bank" },
      { name: "Burn Unit" },
      { name: "Cardiology Department" },
      { name: "Oncology Ward" },
      { name: "Orthopedic Department" },
      { name: "Neurology Department" },
      { name: "Physical Therapy" },
      { name: "Ambulance Service" },
      { name: "Medical Research Center" }
    ]
  },
  {
    name: "Hotel",
    locations: [
      { name: "Luxury Hotel" },
      { name: "Beach Resort" },
      { name: "Mountain Lodge" },
      { name: "City Hotel" },
      { name: "Spa Resort" },
      { name: "Casino Hotel" },
      { name: "Boutique Hotel" },
      { name: "Hostel" },
      { name: "Motel" },
      { name: "Bed and Breakfast" },
      { name: "Heritage Hotel" },
      { name: "Safari Lodge" },
      { name: "Ice Hotel" },
      { name: "Treehouse Hotel" },
      { name: "Underwater Hotel" },
      { name: "Desert Camp" },
      { name: "Floating Hotel" },
      { name: "Historic Inn" },
      { name: "Eco Resort" },
      { name: "Luxury Villa" }
    ]
  },
  {
    name: "School",
    locations: [
      { name: "Elementary School" },
      { name: "High School" },
      { name: "University" },
      { name: "Art School" },
      { name: "Music School" },
      { name: "Sports Academy" },
      { name: "Culinary School" },
      { name: "Military Academy" },
      { name: "Language School" },
      { name: "Dance Studio" },
      { name: "Medical School" },
      { name: "Law School" },
      { name: "Engineering College" },
      { name: "Business School" },
      { name: "Film School" },
      { name: "Theater School" },
      { name: "Architecture School" },
      { name: "Veterinary School" },
      { name: "Agricultural College" },
      { name: "Maritime Academy" }
    ]
  },
  {
    name: "Transport",
    locations: [
      { name: "Airport" },
      { name: "Train Station" },
      { name: "Bus Terminal" },
      { name: "Subway Station" },
      { name: "Cruise Ship" },
      { name: "Ferry Terminal" },
      { name: "Space Station" },
      { name: "Heliport" },
      { name: "Cable Car Station" },
      { name: "Bicycle Shop" },
      { name: "Car Dealership" },
      { name: "Gas Station" },
      { name: "Auto Repair Shop" },
      { name: "Boat Marina" },
      { name: "Horse Stable" },
      { name: "Skateboard Park" },
      { name: "Segway Rental" },
      { name: "Hot Air Balloon Launch" },
      { name: "Hang Gliding Center" },
      { name: "Parachuting Center" }
    ]
  },
  {
    name: "Entertainment",
    locations: [
      { name: "Movie Theater" },
      { name: "Concert Hall" },
      { name: "Amusement Park" },
      { name: "Zoo" },
      { name: "Aquarium" },
      { name: "Circus" },
      { name: "Comedy Club" },
      { name: "Bowling Alley" },
      { name: "Arcade" },
      { name: "Escape Room" },
      { name: "Opera House" },
      { name: "Art Gallery" },
      { name: "Museum" },
      { name: "Theater" },
      { name: "Karaoke Bar" },
      { name: "Casino" },
      { name: "Theme Park" },
      { name: "Water Park" },
      { name: "Virtual Reality Center" },
      { name: "Laser Tag Arena" }
    ]
  },
  {
    name: "Shopping",
    locations: [
      { name: "Shopping Mall" },
      { name: "Grocery Store" },
      { name: "Fashion Boutique" },
      { name: "Bookstore" },
      { name: "Electronics Store" },
      { name: "Flea Market" },
      { name: "Antique Shop" },
      { name: "Toy Store" },
      { name: "Jewelry Store" },
      { name: "Hardware Store" },
      { name: "Department Store" },
      { name: "Souvenir Shop" },
      { name: "Art Supply Store" },
      { name: "Sports Equipment Store" },
      { name: "Music Store" },
      { name: "Pet Shop" },
      { name: "Garden Center" },
      { name: "Furniture Store" },
      { name: "Craft Store" },
      { name: "Vintage Shop" }
    ]
  },
  {
    name: "Nature",
    locations: [
      { name: "Beach" },
      { name: "Forest" },
      { name: "Mountain" },
      { name: "Desert" },
      { name: "Jungle" },
      { name: "Arctic" },
      { name: "Volcano" },
      { name: "Cave" },
      { name: "Island" },
      { name: "National Park" },
      { name: "Rainforest" },
      { name: "Savanna" },
      { name: "Coral Reef" },
      { name: "Glacier" },
      { name: "Waterfall" },
      { name: "Lake" },
      { name: "River" },
      { name: "Valley" },
      { name: "Canyon" },
      { name: "Wetland" }
    ]
  },
  {
    name: "Workplace",
    locations: [
      { name: "Office Building" },
      { name: "Factory" },
      { name: "Construction Site" },
      { name: "Farm" },
      { name: "Warehouse" },
      { name: "Restaurant Kitchen" },
      { name: "Newsroom" },
      { name: "Studio" },
      { name: "Research Lab" },
      { name: "Mine" },
      { name: "Bakery" },
      { name: "Print Shop" },
      { name: "Auto Repair Shop" },
      { name: "Salon" },
      { name: "Bank" },
      { name: "Post Office" },
      { name: "Library" },
      { name: "School" },
      { name: "Hospital" },
      { name: "Police Station" }
    ]
  },
  {
    name: "Sports",
    locations: [
      { name: "Stadium" },
      { name: "Gym" },
      { name: "Swimming Pool" },
      { name: "Tennis Court" },
      { name: "Golf Course" },
      { name: "Ice Rink" },
      { name: "Ski Resort" },
      { name: "Boxing Ring" },
      { name: "Racing Track" },
      { name: "Rock Climbing Gym" },
      { name: "Soccer Field" },
      { name: "Basketball Court" },
      { name: "Baseball Field" },
      { name: "Rugby Field" },
      { name: "Cricket Ground" },
      { name: "Hockey Rink" },
      { name: "Volleyball Court" },
      { name: "Badminton Court" },
      { name: "Skateboard Park" },
      { name: "Yoga Studio" }
    ]
  },
  {
    name: "Countries",
    locations: [
      // Arab Countries
      { name: "Saudi Arabia" },
      { name: "United Arab Emirates" },
      { name: "Egypt" },
      { name: "Iraq" },
      { name: "Syria" },
      { name: "Jordan" },
      { name: "Lebanon" },
      { name: "Kuwait" },
      { name: "Bahrain" },
      { name: "Qatar" },
      { name: "Oman" },
      { name: "Yemen" },
      { name: "Libya" },
      { name: "Tunisia" },
      { name: "Algeria" },
      { name: "Morocco" },
      { name: "Sudan" },
      { name: "Mauritania" },
      { name: "Djibouti" },
      { name: "Somalia" },
      { name: "Comoros" },
      // Other Countries
      { name: "United States" },
      { name: "Canada" },
      { name: "United Kingdom" },
      { name: "France" },
      { name: "Germany" },
      { name: "Italy" },
      { name: "Spain" },
      { name: "Portugal" },
      { name: "Netherlands" },
      { name: "Belgium" },
      { name: "Switzerland" },
      { name: "Austria" },
      { name: "Sweden" },
      { name: "Norway" },
      { name: "Denmark" },
      { name: "Finland" },
      { name: "Russia" },
      { name: "China" },
      { name: "Japan" },
      { name: "South Korea" },
      { name: "India" },
      { name: "Brazil" },
      { name: "Argentina" },
      { name: "Mexico" },
      { name: "Australia" },
      { name: "New Zealand" },
      { name: "South Africa" },
      { name: "Nigeria" },
      { name: "Kenya" },
      { name: "Turkey" },
      { name: "Iran" },
      { name: "Thailand" },
      { name: "Vietnam" },
      { name: "Malaysia" },
      { name: "Singapore" },
      { name: "Philippines" },
      { name: "Indonesia" },
      { name: "Pakistan" },
      { name: "Bangladesh" },
      { name: "Sri Lanka" },
      { name: "Nepal" },
      { name: "Myanmar" },
      { name: "Cambodia" },
      { name: "Laos" },
      { name: "Mongolia" },
      { name: "Kazakhstan" },
      { name: "Uzbekistan" },
      { name: "Azerbaijan" },
      { name: "Georgia" },
      { name: "Armenia" },
      { name: "Ukraine" },
      { name: "Poland" },
      { name: "Czech Republic" },
      { name: "Hungary" },
      { name: "Romania" },
      { name: "Bulgaria" },
      { name: "Greece" },
      { name: "Croatia" },
      { name: "Serbia" },
      { name: "Slovakia" },
      { name: "Slovenia" },
      { name: "Estonia" },
      { name: "Latvia" },
      { name: "Lithuania" },
      { name: "Iceland" },
      { name: "Ireland" },
      { name: "Cyprus" },
      { name: "Malta" },
      { name: "Luxembourg" },
      { name: "Liechtenstein" },
      { name: "Andorra" },
      { name: "Monaco" },
      { name: "San Marino" },
      { name: "Vatican City" },
      { name: "Palestine" }
    ]
  },
  {
    name: "MIT",
    locations: [
      { name: "Hayden Library" },
      { name: "Barker Library" },
      { name: "McCormick Hall" },
      { name: "Maseeh Hall" },
      { name: "W11" },
      { name: "Lobdell" },
      { name: "Walker Memorial" },
      { name: "Stata" },
      { name: "Killian Court" },
      { name: "Great Dome" },
      { name: "Sloan" },
      { name: "Kresge Auditorium" },
      { name: "Lobby 7" },
      { name: "Lobby 10" },
      { name: "Banana Lounge" },
      { name: "MSA Lounge" },
      { name: "Z Center" },
      { name: "Alumni Wang Gym" },
    ]
  }
]; 
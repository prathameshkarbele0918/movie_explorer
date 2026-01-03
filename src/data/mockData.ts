export interface Movie {
  id: number;
  title: string;
  releaseYear: number;
  rating: number;
  posterUrl: string;
  backdropUrl: string;
  runtime: number;
  genres: string[];
  overview: string;
  cast: { name: string; character: string; imageUrl: string }[];
  trailers: { id: string; title: string; thumbnailUrl: string }[];
}

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "The Dark Knight",
    releaseYear: 2008,
    rating: 9.0,
    posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1200&h=600&fit=crop",
    runtime: 152,
    genres: ["Action", "Crime", "Drama"],
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    cast: [
      { name: "Christian Bale", character: "Bruce Wayne", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
      { name: "Heath Ledger", character: "Joker", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
      { name: "Aaron Eckhart", character: "Harvey Dent", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
      { name: "Michael Caine", character: "Alfred", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
      { name: "Gary Oldman", character: "Gordon", imageUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop" },
    ],
    trailers: [
      { id: "1", title: "Official Trailer", thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=320&h=180&fit=crop" },
      { id: "2", title: "Teaser", thumbnailUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=320&h=180&fit=crop" },
    ],
  },
  {
    id: 2,
    title: "Inception",
    releaseYear: 2010,
    rating: 8.8,
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=600&fit=crop",
    runtime: 148,
    genres: ["Action", "Sci-Fi", "Thriller"],
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    cast: [
      { name: "Leonardo DiCaprio", character: "Cobb", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
      { name: "Joseph Gordon-Levitt", character: "Arthur", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
      { name: "Ellen Page", character: "Ariadne", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
      { name: "Tom Hardy", character: "Eames", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
      { name: "Ken Watanabe", character: "Saito", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    ],
    trailers: [
      { id: "1", title: "Official Trailer", thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=320&h=180&fit=crop" },
    ],
  },
  {
    id: 3,
    title: "Interstellar",
    releaseYear: 2014,
    rating: 8.6,
    posterUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=450&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&h=600&fit=crop",
    runtime: 169,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    cast: [
      { name: "Matthew McConaughey", character: "Cooper", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
      { name: "Anne Hathaway", character: "Brand", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
      { name: "Jessica Chastain", character: "Murph", imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
      { name: "Michael Caine", character: "Professor Brand", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
      { name: "Matt Damon", character: "Mann", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
    ],
    trailers: [
      { id: "1", title: "Official Trailer", thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=320&h=180&fit=crop" },
      { id: "2", title: "IMAX Trailer", thumbnailUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=320&h=180&fit=crop" },
    ],
  },
  {
    id: 4,
    title: "Pulp Fiction",
    releaseYear: 1994,
    rating: 8.9,
    posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=600&fit=crop",
    runtime: 154,
    genres: ["Crime", "Drama"],
    overview: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    cast: [
      { name: "John Travolta", character: "Vincent Vega", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
      { name: "Uma Thurman", character: "Mia Wallace", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
      { name: "Samuel L. Jackson", character: "Jules", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
      { name: "Bruce Willis", character: "Butch", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
      { name: "Harvey Keitel", character: "The Wolf", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    ],
    trailers: [
      { id: "1", title: "Official Trailer", thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=320&h=180&fit=crop" },
    ],
  },
  {
    id: 5,
    title: "The Matrix",
    releaseYear: 1999,
    rating: 8.7,
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=600&fit=crop",
    runtime: 136,
    genres: ["Action", "Sci-Fi"],
    overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    cast: [
      { name: "Keanu Reeves", character: "Neo", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
      { name: "Laurence Fishburne", character: "Morpheus", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
      { name: "Carrie-Anne Moss", character: "Trinity", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
      { name: "Hugo Weaving", character: "Agent Smith", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
      { name: "Joe Pantoliano", character: "Cypher", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    ],
    trailers: [
      { id: "1", title: "Official Trailer", thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=320&h=180&fit=crop" },
    ],
  },
  {
    id: 6,
    title: "Fight Club",
    releaseYear: 1999,
    rating: 8.8,
    posterUrl: "https://images.unsplash.com/photo-1555992457-b8fefdd09069?w=300&h=450&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1555992457-b8fefdd09069?w=1200&h=600&fit=crop",
    runtime: 139,
    genres: ["Drama"],
    overview: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    cast: [
      { name: "Brad Pitt", character: "Tyler Durden", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
      { name: "Edward Norton", character: "Narrator", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
      { name: "Helena Bonham Carter", character: "Marla", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
      { name: "Meat Loaf", character: "Bob", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
      { name: "Jared Leto", character: "Angel Face", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    ],
    trailers: [
      { id: "1", title: "Official Trailer", thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=320&h=180&fit=crop" },
    ],
  },
];

export const getMovieById = (id: number): Movie | undefined => {
  return mockMovies.find((movie) => movie.id === id);
};

export const searchMovies = (query: string): Movie[] => {
  if (!query.trim()) return mockMovies;
  return mockMovies.filter((movie) =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );
};

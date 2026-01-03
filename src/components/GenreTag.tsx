interface GenreTagProps {
  genre: string;
}

const GenreTag = ({ genre }: GenreTagProps) => {
  return (
    <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
      {genre}
    </span>
  );
};

export default GenreTag;

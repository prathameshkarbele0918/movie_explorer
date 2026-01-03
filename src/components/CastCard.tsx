interface CastCardProps {
  name: string;
  character: string;
  imageUrl: string;
}

const CastCard = ({ name, character, imageUrl }: CastCardProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="h-20 w-20 overflow-hidden rounded-full bg-muted">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
      <p className="mt-2 font-medium text-sm text-card-foreground">{name}</p>
      <p className="text-xs text-muted-foreground">{character}</p>
    </div>
  );
};

export default CastCard;

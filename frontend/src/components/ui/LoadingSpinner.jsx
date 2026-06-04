const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} border-2 border-[#8B1E3F] border-t-transparent rounded-full animate-spin`} />
      {text && <p className="text-[#FAFAFA]/40 text-sm tracking-wider">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;

import dynamic from 'next/dynamic';

const SepetCard = dynamic(() => import('./SepetCard'), {
  ssr: false,
});

export default SepetCard;

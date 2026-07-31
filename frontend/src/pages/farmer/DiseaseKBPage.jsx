import { useEffect, useState } from 'react';
import { getKnowledgeBase } from '@api/cropApi';
import PageHeader from '@components/layout/PageHeader';
import DiseaseKnowledgeCard from '@components/farmer/DiseaseKnowledgeCard';
import Loader from '@components/ui/Loader';

const STATIC_KB = [
  {
    disease_code: 'tomato_early_blight',
    disease_name: 'Early Blight',
    crop_type: 'Tomato',
    scientific_name: 'Alternaria solani',
    description: 'Fungal disease causing target-ring lesions on leaves and defoliation.',
    symptoms: ['Concentric dark spots on lower leaves', 'Yellow halo surrounding spots'],
    chemical_treatment: 'Spray Copper Oxychloride 50 WP (3g/L).',
    organic_treatment: 'Spray Neem Oil 1500 ppm (5ml/L).',
    government_advisory: 'ICAR Advisory: Remove and destroy infected lower leaves.',
    image_icon: '🍅',
  },
  {
    disease_code: 'paddy_rice_blast',
    disease_name: 'Rice Blast',
    crop_type: 'Paddy',
    scientific_name: 'Magnaporthe oryzae',
    description: 'Spindle-shaped spots on leaves and neck rot on flower panicles.',
    symptoms: ['Spindle-shaped grey lesions', 'Panicle neck black rot'],
    chemical_treatment: 'Spray Tricyclazole 75 WP (0.6g/L).',
    organic_treatment: 'Spray Pseudomonas fluorescens (10g/L).',
    government_advisory: 'TNAU/ANGRAU Advisory: Avoid excess nitrogen fertiliser.',
    image_icon: '🌾',
  },
];

export default function DiseaseKBPage() {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getKnowledgeBase()
      .then((data) => setDiseases(Array.isArray(data) && data.length ? data : STATIC_KB))
      .catch(() => setDiseases(STATIC_KB))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section screen-enter">
      <PageHeader title="Disease Knowledge Base" subtitle="ICAR & KVK Grounded Extension Database" />

      {loading ? (
        <Loader variant="spinner" message="Loading Knowledge Base..." />
      ) : (
        <div>
          {diseases.map((d) => (
            <DiseaseKnowledgeCard key={d.disease_code} disease={d} />
          ))}
        </div>
      )}
    </div>
  );
}

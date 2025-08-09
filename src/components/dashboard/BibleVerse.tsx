import React, { useState, useEffect } from 'react';
import { Book, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';

interface BibleVerse {
  reference: string;
  text: string;
  date: string;
}

export const BibleVerse: React.FC = () => {
  const [verse, setVerse] = useState<BibleVerse | null>(null);
  const [loading, setLoading] = useState(true);

  // Collection de versets bibliques Louis Segond
  const bibleVerses = [
    {
      reference: "Psaume 23:1",
      text: "L'Éternel est mon berger: je ne manquerai de rien."
    },
    {
      reference: "Jean 3:16",
      text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle."
    },
    {
      reference: "Philippiens 4:13",
      text: "Je puis tout par celui qui me fortifie."
    },
    {
      reference: "Proverbes 3:5-6",
      text: "Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse; reconnais-le dans toutes tes voies, et il aplanira tes sentiers."
    },
    {
      reference: "Matthieu 6:33",
      text: "Cherchez premièrement le royaume et la justice de Dieu; et toutes ces choses vous seront données par-dessus."
    },
    {
      reference: "Romains 8:28",
      text: "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein."
    },
    {
      reference: "Psaume 37:4",
      text: "Fais de l'Éternel tes délices, et il te donnera ce que ton cœur désire."
    },
    {
      reference: "Ésaïe 40:31",
      text: "Mais ceux qui se confient en l'Éternel renouvellent leur force. Ils prennent le vol comme les aigles; ils courent, et ne se lassent point; ils marchent, et ne se fatiguent point."
    },
    {
      reference: "Jérémie 29:11",
      text: "Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance."
    },
    {
      reference: "Matthieu 11:28",
      text: "Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos."
    },
    {
      reference: "Psaume 46:2",
      text: "C'est pourquoi nous sommes sans crainte quand la terre est bouleversée, et que les montagnes chancellent au cœur des mers."
    },
    {
      reference: "1 Corinthiens 10:13",
      text: "Aucune tentation ne vous est survenue qui n'ait été humaine, et Dieu, qui est fidèle, ne permettra pas que vous soyez tentés au delà de vos forces."
    },
    {
      reference: "Psaume 121:1-2",
      text: "Je lève mes yeux vers les montagnes... D'où me viendra le secours? Le secours me vient de l'Éternel, qui a fait les cieux et la terre."
    },
    {
      reference: "Matthieu 7:7",
      text: "Demandez, et l'on vous donnera; cherchez, et vous trouverez; frappez, et l'on vous ouvrira."
    },
    {
      reference: "Psaume 27:1",
      text: "L'Éternel est ma lumière et mon salut: de qui aurais-je crainte? L'Éternel est le soutien de ma vie: de qui aurais-je peur?"
    },
    {
      reference: "Proverbes 16:3",
      text: "Recommande à l'Éternel tes œuvres, et tes projets réussiront."
    },
    {
      reference: "Psaume 91:1-2",
      text: "Celui qui demeure sous l'abri du Très-Haut repose à l'ombre du Tout-Puissant. Je dis à l'Éternel: Mon refuge et ma forteresse, mon Dieu en qui je me confie!"
    },
    {
      reference: "Hébreux 13:5",
      text: "Ne vous livrez pas à l'amour de l'argent; contentez-vous de ce que vous avez; car Dieu lui-même a dit: Je ne te délaisserai point, et je ne t'abandonnerai point."
    },
    {
      reference: "Psaume 118:24",
      text: "C'est ici la journée que l'Éternel a faite: qu'elle soit pour nous un sujet d'allégresse et de joie!"
    },
    {
      reference: "Colossiens 3:23",
      text: "Tout ce que vous faites, faites-le de bon cœur, comme pour le Seigneur et non pour des hommes."
    },
    {
      reference: "Psaume 139:14",
      text: "Je te loue de ce que je suis une créature si merveilleuse. Tes œuvres sont admirables, et mon âme le reconnaît bien."
    },
    {
      reference: "Matthieu 5:16",
      text: "Que votre lumière luise ainsi devant les hommes, afin qu'ils voient vos bonnes œuvres, et qu'ils glorifient votre Père qui est dans les cieux."
    },
    {
      reference: "Psaume 34:8",
      text: "Sentez et voyez combien l'Éternel est bon! Heureux l'homme qui cherche en lui son refuge!"
    },
    {
      reference: "Galates 6:9",
      text: "Ne nous lassons pas de faire le bien; car nous moissonnerons au temps convenable, si nous ne nous relâchons pas."
    },
    {
      reference: "Psaume 103:2-3",
      text: "Mon âme, bénis l'Éternel, et n'oublie aucun de ses bienfaits! C'est lui qui pardonne toutes tes iniquités, qui guérit toutes tes maladies."
    },
    {
      reference: "Proverbes 27:1",
      text: "Ne te vante pas du lendemain, car tu ne sais pas ce qu'un jour peut enfanter."
    },
    {
      reference: "Psaume 55:23",
      text: "Remets ton sort à l'Éternel, et il te soutiendra, il ne laissera jamais chanceler le juste."
    },
    {
      reference: "Matthieu 6:26",
      text: "Regardez les oiseaux du ciel: ils ne sèment ni ne moissonnent, et ils n'amassent rien dans des greniers; et votre Père céleste les nourrit. Ne valez-vous pas beaucoup plus qu'eux?"
    },
    {
      reference: "Psaume 16:11",
      text: "Tu me feras connaître le sentier de la vie; il y a d'abondantes joies devant ta face, des délices éternelles à ta droite."
    },
    {
      reference: "Éphésiens 2:10",
      text: "Car nous sommes son ouvrage, ayant été créés en Jésus-Christ pour de bonnes œuvres, que Dieu a préparées d'avance, afin que nous les pratiquions."
    },
    {
      reference: "Psaume 32:8",
      text: "Je t'instruirai et te montrerai la voie que tu dois suivre; je te conseillerai, j'aurai le regard sur toi."
    }
  ];

  const getDailyVerse = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const verseIndex = dayOfYear % bibleVerses.length;
    
    return {
      ...bibleVerses[verseIndex],
      date: today.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
  };

  useEffect(() => {
    setLoading(true);
    // Simulate loading time
    setTimeout(() => {
      setVerse(getDailyVerse());
      setLoading(false);
    }, 500);
  }, []);

  const refreshVerse = () => {
    setLoading(true);
    setTimeout(() => {
      setVerse(getDailyVerse());
      setLoading(false);
    }, 300);
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-blue-600 mt-2">Chargement du verset...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Book className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">Verset du jour</h3>
          </div>
          <button
            onClick={refreshVerse}
            className="p-1 hover:bg-blue-100 rounded-full transition-colors"
            title="Actualiser"
          >
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </button>
        </div>
        
        {verse && (
          <div className="space-y-2">
            <p className="text-sm text-blue-800 italic leading-relaxed">
              "{verse.text}"
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-blue-700">
                {verse.reference}
              </p>
              <p className="text-xs text-blue-600">
                {verse.date}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
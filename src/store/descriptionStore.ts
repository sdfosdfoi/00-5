import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Типы для описания видео
export interface VideoDescription {
  id: string;
  userId: string;
  prompt: string;
  result: string;
  createdAt: string;
}

// Типы для состояния описаний
interface DescriptionState {
  descriptions: VideoDescription[];
  loading: boolean;
  error: string | null;
  
  // Методы
  generateDescription: (prompt: string) => Promise<VideoDescription>;
  getDescriptions: () => VideoDescription[];
  getDescription: (id: string) => VideoDescription | undefined;
  deleteDescription: (id: string) => void;
}

// Генерация уникального ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Имитация вызова API ChatGPT
const mockGenerateWithAI = async (prompt: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Шаблоны описаний для разных типов видео
  const templates = [
    `Это увлекательное видео о ${prompt} предлагает зрителям уникальный взгляд на данную тему. В ролике подробно рассматриваются ключевые аспекты и предоставляется полезная информация для всех, кто интересуется этой темой. Автор делится ценными советами и показывает практические примеры, которые помогут лучше понять материал.`,
    
    `В этом познавательном видео вы узнаете всё о ${prompt}. Автор подробно рассказывает о важных нюансах и делится профессиональными секретами. Видео содержит много полезной информации как для новичков, так и для опытных пользователей. Благодаря четким объяснениям и наглядным примерам, материал легко усваивается.`,
    
    `Представляем вашему вниманию информативное видео на тему "${prompt}". В этом ролике вы найдете исчерпывающую информацию по данному вопросу, а также практические советы, которые можно сразу применить. Автор рассказывает о своем опыте и делится проверенными методиками, которые помогут вам достичь желаемых результатов.`,
    
    `Это видео о ${prompt} станет вашим надежным помощником в освоении данной темы. Здесь вы найдете подробные инструкции, полезные советы и интересные факты. Автор делится своими знаниями и опытом, помогая зрителям разобраться даже в самых сложных аспектах темы. Материал представлен в доступной форме с наглядными примерами.`
  ];
  
  // Выбор случайного шаблона
  return templates[Math.floor(Math.random() * templates.length)];
};

// Хранилище описаний с постоянным хранением
export const useDescriptionStore = create<DescriptionState>()(
  persist(
    (set, get) => ({
      descriptions: [],
      loading: false,
      error: null,
      
      // Генерация нового описания
      generateDescription: async (prompt: string) => {
        try {
          set({ loading: true, error: null });
          
          // Получение пользовательского ID из localStorage (в реальном приложении брали бы из authStore)
          const authData = localStorage.getItem('auth-storage');
          const userData = authData ? JSON.parse(authData).state.user : null;
          const userId = userData ? userData.id : 'guest';
          
          // Имитация генерации с помощью AI
          const result = await mockGenerateWithAI(prompt);
          
          const newDescription: VideoDescription = {
            id: generateId(),
            userId,
            prompt,
            result,
            createdAt: new Date().toISOString(),
          };
          
          set(state => ({
            descriptions: [newDescription, ...state.descriptions],
            loading: false,
          }));
          
          return newDescription;
        } catch (error) {
          set({ loading: false, error: (error as Error).message });
          throw error;
        }
      },
      
      // Получение всех описаний текущего пользователя
      getDescriptions: () => {
        const authData = localStorage.getItem('auth-storage');
        const userData = authData ? JSON.parse(authData).state.user : null;
        const userId = userData ? userData.id : null;
        
        if (!userId) return [];
        
        // Фильтрация описаний по ID пользователя
        return get().descriptions.filter(desc => desc.userId === userId);
      },
      
      // Получение конкретного описания по ID
      getDescription: (id: string) => {
        return get().descriptions.find(desc => desc.id === id);
      },
      
      // Удаление описания
      deleteDescription: (id: string) => {
        set(state => ({
          descriptions: state.descriptions.filter(desc => desc.id !== id),
        }));
      },
    }),
    {
      name: 'descriptions-storage',
    }
  )
);
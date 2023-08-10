import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const useIsGoing = (hangoutId: string, sessionId: string) => {
  const [isGoing, setIsGoing] = useState(false); // Initialize as false

  useEffect(() => {
    const checkIsGoing = async () => {
      const { data, error } = await supabase
        .from('is_going')
        .select()
        .eq('hangout_id', hangoutId)
        .eq('user_id', sessionId);

      if (data && data.length > 0) {
        setIsGoing(true);
      } else {
        setIsGoing(false);
      }
    };

    checkIsGoing();
  }, [hangoutId, sessionId]); // Removed 'isGoing' from the dependency array

  return { isGoing, setIsGoing };
};

export default useIsGoing;

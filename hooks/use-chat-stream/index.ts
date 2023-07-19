// use

//  const { chatAnswer } = useChatStream(id, {
//     loading,
//     onModifyChatItem,
//     onChangeLoading,
//     defaultChatAnswer: preAnswer,
//   });

import { useEffect } from 'react';
import { useSafeState } from 'ahooks';
import dayjs from 'dayjs';
import { AiChatMessage } from '@/api/aigc';
import Typewriter from './typewriter';

function getSseUrl(id: number) {
  const prefix = process.env.NODE_ENV === 'development' ? '/test' : '';
  return `${prefix}/cloud/ai-server/ai/sse/question/send?historyId=${id}`;
}

function useChatStream(
  historyId: number,
  options: {
    loading?: boolean;
    defaultChatAnswer?: string;
    onChangeLoading?: (loading: boolean) => void;
    onModifyChatItem: (id: number, info: Partial<AiChatMessage>) => void;
  },
) {
  const { loading, onChangeLoading, defaultChatAnswer, onModifyChatItem } =
    options;

  const [chatAnswer, setChatAnswer] = useSafeState(defaultChatAnswer);

  useEffect(() => {
    setChatAnswer(defaultChatAnswer);
  }, [defaultChatAnswer]);

  useEffect(() => {
    if (!loading || !!chatAnswer) return;
    const typeWriter = new Typewriter((str: string) => {
      setChatAnswer((prev) => (prev || '') + str);
    });
    const eventSource = new EventSource(getSseUrl(historyId));

    eventSource.onmessage = (event) => {
      try {
        const nextContent = JSON.parse(event.data);
        if (!nextContent?.message) return;
        typeWriter.add(nextContent?.message);
        if (!typeWriter.consuming) {
          typeWriter.start();
        }
      } catch (e) {
        console.log('>>>: ', e);
      }
      // 处理数据
    };

    eventSource.onerror = () => {
      // 处理错误
      typeWriter.done();
      eventSource.close();
      onModifyChatItem(historyId, {
        chatAnswer,
        chatAnswerCreateTime: dayjs().format('YYYY-MM-DD hh:mm:ss'),
      });
      onChangeLoading?.(false);
    };
    // aigcApi
    //   .getChatAnswerById({ historyId }, (e) => {
    //     const nextContent = e?.event?.target?.response;
    //     console.log('onDownloadProgress:', e, nextContent);
    //     typeWriter.add(nextContent);
    //   })
    //   .then((res) => {
    //     console.log('>>>>>>>', res);
    //     setChatAnswer(res?.data || '');
    //     if (res.success) {
    //       typeWriter.done();
    //       onModifyChatItem(historyId, {
    //         chatAnswer: res?.data,
    //         chatAnswerCreateTime: dayjs().format('YYYY-MM-DD hh:mm:ss'),
    //       });
    //     }
    //   })
    //   .finally(() => onChangeLoading?.(false));
    return () => {
      eventSource.close();
      typeWriter.done();
    }
  }, [historyId, loading]);

  return {
    chatAnswer,
  };
}

export default useChatStream;

import { useEffect } from 'react';
import { useSafeState } from 'ahooks';
import { EventEmitter } from 'ahooks/es/useEventEmitter';
import { App } from 'antd';
import dayjs from 'dayjs';
import { AiChatMessage } from '@/api/aigc';
import Typewriter from './typewriter';

const TIMEOUT = 1000 * 60 * 5;

function getSseUrl(id: number) {
  return `/cloud/ai-server/ai/sse/question/send?historyId=${id}`;
}

function useChatStream(
  historyId: number,
  options: {
    loading?: boolean;
    defaultChatAnswer?: string;
    onChangeLoading?: (loading: boolean) => void;
    onModifyChatItem: (id: number, info: Partial<AiChatMessage>) => void;
    eventEmitter: EventEmitter<string>;
  },
) {
  const {
    loading,
    onChangeLoading,
    defaultChatAnswer,
    onModifyChatItem,
    eventEmitter,
  } = options;

  const [chatAnswer, setChatAnswer] = useSafeState(defaultChatAnswer);

  useEffect(() => {
    setChatAnswer(defaultChatAnswer);
  }, [defaultChatAnswer]);

  const { message } = App.useApp();

  useEffect(() => {
    if (!loading || !!chatAnswer) return;
    const typeWriter = new Typewriter((str: string) => {
      setChatAnswer((prev) => (prev || '') + str);
      eventEmitter?.emit('typingAnswer');
    });
    const eventSource = new EventSource(getSseUrl(historyId));
    const finishTyping = () => {
      eventSource.close();
      typeWriter.done();
      onModifyChatItem(historyId, {
        chatAnswer,
        chatAnswerCreateTime: dayjs().format('YYYY-MM-DD hh:mm:ss'),
      });
      onChangeLoading?.(false);
    };
    // 超时处理
    const timer = setTimeout(() => {
      message.error('诊断失败，请缩小部门范围或稍后再试');
      finishTyping();
    }, TIMEOUT);

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

    eventSource.addEventListener('errorMessage', () => {
      message.error('诊断失败，请缩小部门范围或稍后再试');
    });

    eventSource.onerror = () => {
      finishTyping();
      clearTimeout(timer);
    };
    return () => {
      eventSource.close();
      typeWriter.done();
      clearTimeout(timer);
    };
  }, [historyId, loading]);

  return {
    chatAnswer,
  };
}

export default useChatStream;

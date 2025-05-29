import React, { useEffect, useState } from 'react';
import { Modal, Button, Progress, Typography } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TimeUpModal = ({ visible, onSubmit, examTitle, answeredCount, totalQuestions }) => {
  const [countdown, setCountdown] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (visible && countdown === 0 && !isSubmitting) {
      handleAutoSubmit();
    }
  }, [visible, countdown, isSubmitting]);

  const handleAutoSubmit = () => {
    setIsSubmitting(true);
    onSubmit();
  };

  const handleManualSubmit = () => {
    setIsSubmitting(true);
    onSubmit();
  };

  const completionPercentage = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <Modal
      open={visible}
      closable={false}
      maskClosable={false}
      footer={null}
      centered
      width={500}
      className="time-up-modal"
    >
      <div className="text-center p-6">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClockCircleOutlined className="text-4xl text-red-500" />
          </div>
          <Title level={2} className="text-red-600 mb-2">
            Hết thời gian!
          </Title>
          <Text className="text-gray-600 text-lg">
            Thời gian làm bài đã kết thúc
          </Text>
        </div>

        {/* Exam Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <Title level={4} className="mb-3">
            {examTitle}
          </Title>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Text>Câu đã trả lời:</Text>
              <Text strong className="text-blue-600">
                {answeredCount} / {totalQuestions} câu
              </Text>
            </div>
            <div className="flex justify-between items-center">
              <Text>Tỷ lệ hoàn thành:</Text>
              <Text strong className={completionPercentage >= 80 ? 'text-green-600' : completionPercentage >= 50 ? 'text-orange-600' : 'text-red-600'}>
                {completionPercentage}%
              </Text>
            </div>
            <Progress 
              percent={completionPercentage} 
              strokeColor={completionPercentage >= 80 ? '#52c41a' : completionPercentage >= 50 ? '#faad14' : '#ff4d4f'}
              showInfo={false}
            />
          </div>
        </div>

        {/* Auto Submit Info */}
        {!isSubmitting ? (
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <Text className="text-yellow-800">
                Bài thi sẽ được tự động nộp sau <strong className="text-red-600">{countdown}</strong> giây
              </Text>
            </div>
            <Button 
              type="primary" 
              size="large" 
              onClick={handleManualSubmit}
              icon={<CheckCircleOutlined />}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Nộp bài ngay
            </Button>
          </div>
        ) : (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <Text className="text-blue-800 font-medium">
                  Đang nộp bài thi...
                </Text>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="text-center">
          <Text className="text-gray-500 text-sm">
            Kết quả sẽ được tính dựa trên các câu đã trả lời
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default TimeUpModal;

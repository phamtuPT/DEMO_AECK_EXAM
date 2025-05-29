import React, { useState, useEffect } from 'react';
import { Tag, Button, Space, Tooltip, message } from 'antd';
import {
  CloudOutlined,
  DatabaseOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import storageService from '../services/storageService';

const StorageStatus = () => {
  const [storageMode, setStorageMode] = useState('localStorage');
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    // Check initial storage mode
    setStorageMode(storageService.getStorageMode());
  }, []);

  const handleReconnect = async () => {
    setIsReconnecting(true);
    try {
      const connected = await storageService.reconnectToServer();
      if (connected) {
        setStorageMode('server');
        message.success('Đã kết nối thành công với server!');
      } else {
        message.warning('Không thể kết nối với server. Tiếp tục sử dụng LocalStorage.');
      }
    } catch (error) {
      message.error('Lỗi khi kết nối server.');
    } finally {
      setIsReconnecting(false);
    }
  };

  const getStatusConfig = () => {
    const isProduction = process.env.NODE_ENV === 'production';

    if (storageMode === 'server') {
      return {
        color: 'green',
        icon: <CloudOutlined />,
        text: isProduction ? 'Vercel Server' : 'Local Server',
        description: isProduction
          ? 'Dữ liệu lưu trên Vercel, truy cập toàn cầu từ mọi thiết bị'
          : 'Dữ liệu được lưu trên server, có thể truy cập từ nhiều trình duyệt'
      };
    } else {
      return {
        color: 'orange',
        icon: <DatabaseOutlined />,
        text: 'LocalStorage',
        description: 'Dữ liệu được lưu cục bộ, chỉ truy cập được trên trình duyệt này'
      };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex items-center space-x-2">
      <Tooltip title={config.description}>
        <Tag
          color={config.color}
          icon={config.icon}
          className="flex items-center space-x-1"
        >
          <span>Lưu trữ: {config.text}</span>
        </Tag>
      </Tooltip>

      {storageMode === 'localStorage' && (
        <Tooltip title="Thử kết nối lại với server">
          <Button
            size="small"
            icon={<ReloadOutlined />}
            loading={isReconnecting}
            onClick={handleReconnect}
            type="text"
          >
            Kết nối Server
          </Button>
        </Tooltip>
      )}
    </div>
  );
};

export default StorageStatus;

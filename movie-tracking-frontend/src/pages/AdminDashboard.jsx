import React from 'react';
import { Layout } from 'antd';
import AdminStats from '../components/admin/AdminStats';

const { Content } = Layout;

const AdminDashboard = () => {
    console.log('AdminDashboard component rendering'); // Debug log
    
    return (
        <Layout>
            <Content style={{ padding: '24px' }}>
                <h1>Admin Dashboard</h1>
                <AdminStats />
                {/* Diğer admin bileşenleri buraya eklenebilir */}
            </Content>
        </Layout>
    );
};

export default AdminDashboard; 
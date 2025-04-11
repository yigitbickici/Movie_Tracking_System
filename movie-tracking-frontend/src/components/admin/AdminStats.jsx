import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { MovieOutlined, UserOutlined, FileTextOutlined, TeamOutlined } from '@ant-design/icons';
import adminService from '../../services/adminService';

const AdminStats = () => {
    console.log('AdminStats component rendering'); // Debug log
    
    const [stats, setStats] = useState({
        totalMovies: 0,
        totalUsers: 0,
        totalReviews: 0,
        dailyVisitors: 0,
        totalVisitors: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('useEffect running'); // Debug log
        
        let isMounted = true; // Bileşenin hala mount edilmiş olup olmadığını takip etmek için
        
        const fetchStats = async () => {
            if (!isMounted) return; // Bileşen unmount olduysa işlemi durdur
            
            try {
                console.log('Fetching stats...'); // Debug log
                setLoading(true);
                const data = await adminService.getDashboardStats();
                console.log('Fetched stats:', data); // Debug log
                
                if (isMounted) { // Bileşen hala mount edilmişse state'i güncelle
                    setStats(data);
                    setError(null);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                if (isMounted) {
                    setError('Failed to load statistics');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchStats();
        
        // Her 30 saniyede bir verileri güncelle
        const interval = setInterval(fetchStats, 30000);
        
        // Cleanup function
        return () => {
            console.log('Cleaning up...'); // Debug log
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    if (loading) {
        return <div>Loading statistics...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="admin-stats">
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Movies"
                            value={stats.totalMovies}
                            prefix={<MovieOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Users"
                            value={stats.totalUsers}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Reviews"
                            value={stats.totalReviews}
                            prefix={<FileTextOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card>
                        <Statistic
                            title="Daily Visitors"
                            value={stats.dailyVisitors}
                            prefix={<TeamOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminStats; 
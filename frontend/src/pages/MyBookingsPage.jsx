import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../services/bookingService';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaRupeeSign, FaClock, FaCheckCircle, FaTimesCircle, FaArrowRight, FaSuitcase } from 'react-icons/fa';

function MyBookingsPage() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState({ upcoming: [], past: [], cancelled: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [error, setError] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await getMyBookings();
            setBookings(data);
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                setError('Failed to load bookings. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    const getNights = (s, e) => Math.ceil((new Date(e) - new Date(s)) / (1000 * 60 * 60 * 24));

    const handleCancel = async (e, bookingId) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
        try {
            setCancellingId(bookingId);
            await cancelBooking(bookingId);
            toast.success('Booking cancelled successfully');
            await fetchBookings();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to cancel booking');
        } finally {
            setCancellingId(null);
        }
    };

    const tabs = [
        { key: 'upcoming', label: 'Upcoming', icon: <FaClock />, count: bookings.upcoming?.length || 0 },
        { key: 'past', label: 'Past', icon: <FaCheckCircle />, count: bookings.past?.length || 0 },
        { key: 'cancelled', label: 'Cancelled', icon: <FaTimesCircle />, count: bookings.cancelled?.length || 0 },
    ];

    const currentList = bookings[activeTab] || [];

    // ─── Styles ───────────────────────────────────────────────
    const styles = {
        page: {
            maxWidth: '960px',
            margin: '0 auto',
            padding: '32px 20px 80px',
            minHeight: 'calc(100vh - 64px)',
        },
        header: {
            marginBottom: '32px',
        },
        title: {
            fontSize: '2rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '6px',
        },
        subtitle: {
            color: '#6b7280',
            fontSize: '0.95rem',
        },
        tabBar: {
            display: 'flex',
            gap: '4px',
            marginBottom: '28px',
            background: '#fff1f2',
            borderRadius: '14px',
            padding: '4px',
        },
        tab: (active) => ({
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.85rem',
            transition: 'all 0.25s ease',
            background: active ? 'linear-gradient(135deg, #f43f5e, #fb7185)' : 'transparent',
            color: active ? '#fff' : '#9ca3af',
            boxShadow: active ? '0 4px 14px rgba(244, 63, 94, 0.25)' : 'none',
        }),
        badge: (active) => ({
            background: active ? 'rgba(255,255,255,0.25)' : '#fecdd3',
            color: active ? '#fff' : '#f43f5e',
            borderRadius: '999px',
            padding: '2px 8px',
            fontSize: '0.7rem',
            fontWeight: 800,
        }),
        card: {
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid #ffe4e6',
            overflow: 'hidden',
            marginBottom: '16px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
        },
        cardInner: {
            display: 'flex',
            flexDirection: 'row',
            gap: '0',
        },
        cardImage: {
            width: '200px',
            minHeight: '180px',
            objectFit: 'cover',
            flexShrink: 0,
        },
        cardBody: {
            flex: 1,
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
        cardTitle: {
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '4px',
        },
        cardLocation: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#6b7280',
            fontSize: '0.85rem',
            marginBottom: '14px',
        },
        metaGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '10px',
            marginBottom: '14px',
        },
        metaItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            color: '#4b5563',
        },
        metaIcon: {
            color: '#fb7185',
            fontSize: '0.75rem',
        },
        statusBadge: (status) => {
            const colors = {
                upcoming: { bg: '#dcfce7', color: '#16a34a', text: 'Confirmed' },
                past: { bg: '#f3f4f6', color: '#6b7280', text: 'Completed' },
                cancelled: { bg: '#fee2e2', color: '#dc2626', text: 'Cancelled' },
            };
            const c = colors[status] || colors.past;
            return {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: c.bg,
                color: c.color,
            };
        },
        viewBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            color: '#f43f5e',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            padding: '6px 0',
            transition: 'all 0.2s ease',
        },
        emptyState: {
            textAlign: 'center',
            padding: '60px 20px',
        },
        emptyIcon: {
            fontSize: '3rem',
            color: '#fda4af',
            marginBottom: '16px',
        },
        emptyTitle: {
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#374151',
            marginBottom: '8px',
        },
        emptyText: {
            color: '#9ca3af',
            fontSize: '0.9rem',
            marginBottom: '20px',
        },
        exploreBtn: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #f43f5e, #fb7185)',
            color: '#fff',
            padding: '10px 24px',
            borderRadius: '999px',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(244, 63, 94, 0.3)',
            transition: 'all 0.3s ease',
        },
        skeleton: {
            background: 'linear-gradient(90deg, #fff1f2 25%, #ffe4e6 50%, #fff1f2 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '16px',
            height: '180px',
            marginBottom: '16px',
        },
    };

    // ─── Loading state ──────────────────────
    if (loading) {
        return (
            <div style={styles.page}>
                <div style={styles.header}>
                    <h1 style={styles.title}>My Bookings</h1>
                </div>
                <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
                {[1, 2, 3].map((i) => <div key={i} style={styles.skeleton} />)}
            </div>
        );
    }

    // ─── Error state ──────────────────────
    if (error) {
        return (
            <div style={styles.page}>
                <div style={{ ...styles.emptyState }}>
                    <div style={styles.emptyIcon}>⚠️</div>
                    <div style={styles.emptyTitle}>{error}</div>
                    <button style={styles.exploreBtn} onClick={fetchBookings}>Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>My Bookings</h1>
                <p style={styles.subtitle}>
                    {bookings.total || 0} total booking{(bookings.total || 0) !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Tabs */}
            <div style={styles.tabBar}>
                {tabs.map(({ key, label, icon, count }) => (
                    <button key={key} style={styles.tab(activeTab === key)} onClick={() => setActiveTab(key)}>
                        {icon}
                        <span className="hidden sm:inline">{label}</span>
                        <span style={styles.badge(activeTab === key)}>{count}</span>
                    </button>
                ))}
            </div>

            {/* Booking List */}
            {currentList.length === 0 ? (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}><FaSuitcase /></div>
                    <div style={styles.emptyTitle}>
                        No {activeTab} bookings
                    </div>
                    <p style={styles.emptyText}>
                        {activeTab === 'upcoming'
                            ? "You don't have any upcoming stays. Time to explore!"
                            : activeTab === 'past'
                                ? "You haven't completed any trips yet."
                                : "No cancelled bookings."}
                    </p>
                    {activeTab === 'upcoming' && (
                        <button style={styles.exploreBtn} onClick={() => navigate('/listings')}>
                            Explore Stays <FaArrowRight />
                        </button>
                    )}
                </div>
            ) : (
                currentList.map((booking) => {
                    const listing = booking.listingId;
                    const imageUrl = listing?.image?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=60';
                    const nights = getNights(booking.startDate, booking.endDate);

                    return (
                        <div
                            key={booking._id}
                            style={styles.card}
                            onClick={() => listing?._id && navigate(`/listings/${listing._id}`)}
                            onMouseOver={(e) => {
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(244, 63, 94, 0.12)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={styles.cardInner}>
                                {/* Image */}
                                <img
                                    src={imageUrl}
                                    alt={listing?.title || 'Listing'}
                                    style={styles.cardImage}
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=60'; }}
                                />

                                {/* Body */}
                                <div style={styles.cardBody}>
                                    <div>
                                        <h3 style={styles.cardTitle}>{listing?.title || 'Listing removed'}</h3>
                                        <div style={styles.cardLocation}>
                                            <FaMapMarkerAlt style={{ color: '#fb7185', fontSize: '0.7rem' }} />
                                            {listing?.location || 'Unknown'}{listing?.country ? `, ${listing.country}` : ''}
                                        </div>

                                        <div style={styles.metaGrid}>
                                            <div style={styles.metaItem}>
                                                <FaCalendarAlt style={styles.metaIcon} />
                                                {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                                            </div>
                                            <div style={styles.metaItem}>
                                                <FaClock style={styles.metaIcon} />
                                                {nights} night{nights > 1 ? 's' : ''}
                                            </div>
                                            <div style={styles.metaItem}>
                                                <FaUsers style={styles.metaIcon} />
                                                {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                                            </div>
                                            <div style={styles.metaItem}>
                                                <FaRupeeSign style={styles.metaIcon} />
                                                ₹{booking.totalPrice?.toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                        <span style={styles.statusBadge(activeTab)}>
                                            {activeTab === 'upcoming' ? <FaCheckCircle /> : activeTab === 'cancelled' ? <FaTimesCircle /> : <FaClock />}
                                            {activeTab === 'upcoming' ? 'Confirmed' : activeTab === 'past' ? 'Completed' : 'Cancelled'}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {activeTab === 'upcoming' && (
                                                <button
                                                    onClick={(e) => handleCancel(e, booking._id)}
                                                    disabled={cancellingId === booking._id}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '5px',
                                                        padding: '6px 14px',
                                                        borderRadius: '8px',
                                                        border: '1.5px solid #fecdd3',
                                                        background: cancellingId === booking._id ? '#fff1f2' : '#fff',
                                                        color: '#e11d48',
                                                        fontWeight: 700,
                                                        fontSize: '0.78rem',
                                                        cursor: cancellingId === booking._id ? 'not-allowed' : 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        opacity: cancellingId === booking._id ? 0.6 : 1,
                                                    }}
                                                    onMouseOver={(e) => {
                                                        if (cancellingId !== booking._id) {
                                                            e.currentTarget.style.background = '#fff1f2';
                                                            e.currentTarget.style.borderColor = '#f43f5e';
                                                        }
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.background = '#fff';
                                                        e.currentTarget.style.borderColor = '#fecdd3';
                                                    }}
                                                >
                                                    <FaTimesCircle />
                                                    {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                                                </button>
                                            )}
                                            <button
                                                style={styles.viewBtn}
                                                onClick={(e) => { e.stopPropagation(); listing?._id && navigate(`/listings/${listing._id}`); }}
                                                onMouseOver={(e) => { e.currentTarget.style.gap = '8px'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.gap = '4px'; }}
                                            >
                                                View Listing <FaArrowRight />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}

            {/* Responsive styles */}
            <style>{`
        @media (max-width: 640px) {
          .hidden { display: none !important; }
          .sm\\:inline { display: none !important; }
        }
        @media (min-width: 641px) {
          .sm\\:inline { display: inline !important; }
        }
        @media (max-width: 700px) {
          /* Stack card vertically on mobile */
          [style*="flex-direction: row"] {
            flex-direction: column !important;
          }
          img[style*="width: 200px"] {
            width: 100% !important;
            height: 160px !important;
            min-height: unset !important;
          }
        }
      `}</style>
        </div>
    );
}

export default MyBookingsPage;

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format, differenceInCalendarDays, parseISO } from 'date-fns';
import { checkAvailability, createBooking, getBookings } from '../services/bookingService';
import '../styles/BookingWidget.css';

/**
 * BookingWidget — Premium date-range picker with Interval Tree
 * powered availability detection and instant visual feedback.
 *
 * Props:
 *   - listingId   (string)  MongoDB ObjectId of the listing
 *   - pricePerNight (number) price in ₹ per night
 */
function BookingWidget({ listingId, pricePerNight }) {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    // ── State ──────────────────────────────────────────────
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [availability, setAvailability] = useState(null);
    // availability = { status: 'idle' | 'checking' | 'available' | 'unavailable', data: {} }
    const [existingBookings, setExistingBookings] = useState([]);
    const [isBooking, setIsBooking] = useState(false);
    const [confirmed, setConfirmed] = useState(null);

    // ── Fetch existing bookings on mount ───────────────────
    useEffect(() => {
        if (!listingId) return;
        getBookings(listingId)
            .then((res) => setExistingBookings(res.bookings || []))
            .catch(() => { });
    }, [listingId]);

    // ── Auto-check availability when both dates selected ───
    const checkDates = useCallback(async () => {
        if (!startDate || !endDate) {
            setAvailability(null);
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end <= start) {
            setAvailability({
                status: 'unavailable',
                data: { message: 'Check-out must be after check-in' },
            });
            return;
        }

        setAvailability({ status: 'checking', data: {} });

        try {
            const result = await checkAvailability(listingId, startDate, endDate);
            if (result.available) {
                setAvailability({
                    status: 'available',
                    data: { algorithm: result.algorithm },
                });
            } else {
                setAvailability({
                    status: 'unavailable',
                    data: {
                        conflict: result.conflict,
                        algorithm: result.algorithm,
                        message: `Blocked: ${format(parseISO(result.conflict.startDate), 'MMM d')} — ${format(parseISO(result.conflict.endDate), 'MMM d')}`,
                    },
                });
            }
        } catch (err) {
            setAvailability({
                status: 'unavailable',
                data: { message: 'Unable to check availability' },
            });
        }
    }, [listingId, startDate, endDate]);

    useEffect(() => {
        const timer = setTimeout(checkDates, 350); // debounce
        return () => clearTimeout(timer);
    }, [checkDates]);

    // ── Calculated values ──────────────────────────────────
    const nights =
        startDate && endDate
            ? Math.max(differenceInCalendarDays(new Date(endDate), new Date(startDate)), 0)
            : 0;
    const totalPrice = nights * pricePerNight;

    // ── Reserve handler ────────────────────────────────────
    const handleReserve = async () => {
        if (!isLoggedIn) {
            toast.info('Please log in to make a reservation');
            navigate('/login');
            return;
        }

        if (availability?.status !== 'available') return;

        setIsBooking(true);
        try {
            const result = await createBooking(listingId, startDate, endDate, guests);
            setConfirmed(result);
            toast.success('🎉 Booking confirmed!');
            // Refresh existing bookings
            const updated = await getBookings(listingId);
            setExistingBookings(updated.bookings || []);
        } catch (err) {
            const msg =
                err.response?.data?.error || 'Booking failed. Please try again.';
            toast.error(msg);
            // Re-check availability (may have changed due to race condition)
            checkDates();
        } finally {
            setIsBooking(false);
        }
    };

    // ── If booking just confirmed → show success ──────────
    if (confirmed) {
        return (
            <div className="booking-widget">
                <div className="bw-confirmed">
                    <div className="bw-confirmed-icon">🎉</div>
                    <h3>Booking Confirmed!</h3>
                    <p>
                        {format(parseISO(confirmed.booking.startDate), 'MMM d, yyyy')} —{' '}
                        {format(parseISO(confirmed.booking.endDate), 'MMM d, yyyy')}
                    </p>
                    <p style={{ marginTop: 8 }}>
                        {confirmed.priceBreakdown.nights} night
                        {confirmed.priceBreakdown.nights > 1 ? 's' : ''} · ₹
                        {confirmed.priceBreakdown.totalPrice.toLocaleString()}
                    </p>
                    <div className="bw-algo-badge" style={{ marginTop: 16, justifyContent: 'center' }}>
                        <span className="bw-algo-icon">🌳</span>
                        {confirmed.algorithm.name} · {confirmed.algorithm.complexity}
                    </div>
                    <button
                        className="bw-reserve-btn active"
                        style={{ marginTop: 16, fontSize: '0.85rem' }}
                        onClick={() => setConfirmed(null)}
                    >
                        Book another stay
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-widget">
            {/* ── Header ──────────────────────────────────────── */}
            <div className="bw-header">
                <div>
                    <span className="bw-price">₹{pricePerNight?.toLocaleString()}</span>
                    <span className="bw-price-label"> / night</span>
                </div>
            </div>

            {/* ── Algorithm Badge ─────────────────────────────── */}
            <div className="bw-algo-badge">
                <span className="bw-algo-icon">🌳</span>
                Interval Tree · O(log N) Search
            </div>

            {/* ── Date Inputs ─────────────────────────────────── */}
            <div className="bw-dates">
                <div className="bw-date-field">
                    <label htmlFor="bw-checkin">Check-in</label>
                    <input
                        id="bw-checkin"
                        type="date"
                        value={startDate}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="bw-date-field">
                    <label htmlFor="bw-checkout">Check-out</label>
                    <input
                        id="bw-checkout"
                        type="date"
                        value={endDate}
                        min={startDate || format(new Date(), 'yyyy-MM-dd')}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            {/* ── Guests ──────────────────────────────────────── */}
            <div className="bw-guests">
                <label htmlFor="bw-guests">Guests</label>
                <input
                    id="bw-guests"
                    type="number"
                    min="1"
                    max="16"
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                />
            </div>

            {/* ── Availability Feedback ───────────────────────── */}
            {availability && (
                <div className={`bw-status ${availability.status}`}>
                    {availability.status === 'checking' && (
                        <>
                            <div className="bw-spinner" />
                            <span>Searching Interval Tree…</span>
                        </>
                    )}
                    {availability.status === 'available' && (
                        <>
                            <span className="bw-status-icon">✅</span>
                            <span>Dates available!</span>
                        </>
                    )}
                    {availability.status === 'unavailable' && (
                        <>
                            <span className="bw-status-icon">❌</span>
                            <span>{availability.data?.message || 'Dates unavailable'}</span>
                        </>
                    )}
                </div>
            )}

            {/* ── Price Breakdown ─────────────────────────────── */}
            {nights > 0 && availability?.status === 'available' && (
                <div className="bw-breakdown">
                    <div className="bw-breakdown-row">
                        <span>₹{pricePerNight?.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                        <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="bw-breakdown-row">
                        <span>Service fee</span>
                        <span>₹0</span>
                    </div>
                    <div className="bw-breakdown-row total">
                        <span>Total</span>
                        <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                </div>
            )}

            {/* ── Login Prompt ────────────────────────────────── */}
            {!isLoggedIn && (
                <div className="bw-login-prompt">
                    <p>Log in to reserve this stay</p>
                    <a href="/login" className="bw-login-link">Log In</a>
                </div>
            )}

            {/* ── Reserve Button ──────────────────────────────── */}
            <button
                className={`bw-reserve-btn ${availability?.status === 'available' && isLoggedIn && !isBooking
                        ? 'active'
                        : 'disabled'
                    }`}
                disabled={
                    availability?.status !== 'available' || !isLoggedIn || isBooking
                }
                onClick={handleReserve}
            >
                {isBooking ? 'Confirming…' : 'Reserve'}
            </button>

            <p className="bw-footer">You won't be charged yet</p>

            {/* ── Existing Bookings ───────────────────────────── */}
            {existingBookings.length > 0 && (
                <div className="bw-booked-dates">
                    <h4>Upcoming Reservations ({existingBookings.length})</h4>
                    <div className="bw-booked-list">
                        {existingBookings.map((b) => (
                            <div key={b._id} className="bw-booked-item">
                                <span className="bw-booked-dot" />
                                {format(parseISO(b.startDate), 'MMM d')} —{' '}
                                {format(parseISO(b.endDate), 'MMM d, yyyy')}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookingWidget;

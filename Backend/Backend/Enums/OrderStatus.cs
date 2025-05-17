namespace Backend.Enums
{
    public enum OrderStatus
    {
        PENDING,      // Order placed but not yet confirmed
        CONFIRMED,    // Order has been confirmed by the shop
        READY_FOR_PICKUP, // Order is ready to be collected by the user
        COMPLETED,    // Order has been collected
        CANCELLED     // Order was cancelled
    }
}

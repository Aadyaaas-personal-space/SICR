const Notification =
    require("../models/Notification");


// =====================================================
// GET MY NOTIFICATIONS
// GET /api/notifications
// =====================================================

const getMyNotifications = async (
    req,
    res
) => {

    try {

        const {
            type,
            id
        } = req.connectionIdentity;


        const notifications =
            await Notification.find({
                receiverType: type,
                receiverId: id,
            })
                .sort({
                    createdAt: -1,
                });


        return res.status(200).json({
            success: true,

            count:
                notifications.length,

            unreadCount:
                notifications.filter(
                    notification =>
                        !notification.isRead
                ).length,

            notifications,
        });

    } catch (error) {

        console.error(
            "Get Notifications Error:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Server error while fetching notifications",

            error:
                error.message,
        });
    }
};


// =====================================================
// MARK ONE NOTIFICATION AS READ
// PATCH /api/notifications/:notificationId/read
// =====================================================

const markNotificationAsRead = async (
    req,
    res
) => {

    try {

        const {
            type,
            id
        } = req.connectionIdentity;


        const notification =
            await Notification.findOne({
                _id:
                    req.params.notificationId,

                receiverType:
                    type,

                receiverId:
                    id,
            });


        if (!notification) {
            return res.status(404).json({
                success: false,

                message:
                    "Notification not found",
            });
        }


        notification.isRead =
            true;

        notification.readAt =
            new Date();


        await notification.save();


        return res.status(200).json({
            success: true,

            message:
                "Notification marked as read",

            notification,
        });

    } catch (error) {

        console.error(
            "Mark Notification Read Error:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Server error while updating notification",

            error:
                error.message,
        });
    }
};


// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// PATCH /api/notifications/read-all
// =====================================================

const markAllNotificationsAsRead = async (
    req,
    res
) => {

    try {

        const {
            type,
            id
        } = req.connectionIdentity;


        await Notification.updateMany(
            {
                receiverType:
                    type,

                receiverId:
                    id,

                isRead:
                    false,
            },

            {
                $set: {
                    isRead:
                        true,

                    readAt:
                        new Date(),
                },
            }
        );


        return res.status(200).json({
            success: true,

            message:
                "All notifications marked as read",
        });

    } catch (error) {

        console.error(
            "Mark All Notifications Read Error:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Server error while updating notifications",

            error:
                error.message,
        });
    }
};


module.exports = {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
};

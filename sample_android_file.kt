package com.firebase.myapplication

import android.annotation.SuppressLint
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import android.widget.RemoteViews
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import java.io.IOException
import java.net.URL


const val channelId = "notification_channel"
const val channelName = "com.example.myapplication"

class MyFirebaseMessagingService: FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        Log.d(ContentValues.TAG, "Refreshed token: $token")
        val token = "$token"
        println("Running the API Function... -----------")
        val client = OkHttpClient()

        val json = "application/json; charset=utf-8".toMediaTypeOrNull()
        val requestBody = RequestBody.create(json, "{\"token\":\"$token\",\"device\":\"Android\"}")

        val request = Request.Builder()
            .url("http://10.10.6.167:1000/registerdevice")
            .post(requestBody)
            .build()

        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")

            val responseBody = response.body!!.string()
            println(responseBody)
        }
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        Log.d(ContentValues.TAG, "Notification Received !!!")
        if (remoteMessage.getNotification() != null) {
            val title = remoteMessage.notification!!.title
            val body = remoteMessage.notification!!.body
            val image = remoteMessage.data["image"]
            val actionTitle = remoteMessage.data["set_0_input1"]
            val actionUrl = remoteMessage.data["set_0_input2"]

            generateNotification(title!!, body!!, image)
        }
    }

    @SuppressLint("RemoteViewLayout")
    fun getRemoteView(title: String, message: String): RemoteViews {
        val remoteView = RemoteViews("com.firebase.myapplication", R.layout.notification)

        remoteView.setTextViewText(R.id.title, title)
        remoteView.setTextViewText(R.id.message, message)
        remoteView.setImageViewResource(R.id.app_logo, R.drawable.bebo)

        return remoteView
    }

//    @SuppressLint("UnspecifiedImmutableFlag")
//    fun generateNotification(title: String, message: String, imageUrl: String?, actionTitle: String, actionUrl: String) {
//
//        val intent = Intent(this, MainActivity::class.java)
//        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
//        val pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT)
//
//        val notificationManager =
//            getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
//
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//            val notificationChannel =
//                NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_HIGH)
//            notificationManager.createNotificationChannel(notificationChannel)
//        }
//
//        val notificationBuilder: NotificationCompat.Builder = if (isAppInForeground()) {
//            // Custom notification style for foreground
//            NotificationCompat.Builder(applicationContext, channelId)
//                .setSmallIcon(R.drawable.bebo)
//                .setAutoCancel(true)
//                .setVibrate(longArrayOf(1000, 1000, 1000, 1000))
//                .setOnlyAlertOnce(true)
//                .setContentIntent(pendingIntent)
//                .setContentTitle(title)
//                .setContentText(message)
//                .setStyle(NotificationCompat.BigTextStyle().bigText(message))
//                .addAction(
//                    R.drawable.bebo,
//                    actionTitle,
//                    PendingIntent.getActivity(this, 0, Intent(Intent.ACTION_VIEW, Uri.parse(actionUrl)), PendingIntent.FLAG_UPDATE_CURRENT)
//                )
//        } else {
//            // Default notification style for background
//            val notificationStyle = NotificationCompat.BigPictureStyle()
//                .bigPicture(imageUrl?.let { getBitmapFromUrl(it) })
//                .setBigContentTitle(title)
//                .setSummaryText(message)
//
//            NotificationCompat.Builder(applicationContext, channelId)
//                .setSmallIcon(R.drawable.bebo)
//                .setAutoCancel(true)
//                .setVibrate(longArrayOf(1000, 1000, 1000, 1000))
//                .setOnlyAlertOnce(true)
//                .setContentIntent(pendingIntent)
//                .setContentTitle(title)
//                .setContentText(message)
//                .setStyle(notificationStyle)
//                .addAction(
//                    R.drawable.bebo,
//                    actionTitle,
//                    PendingIntent.getActivity(this, 0, Intent(Intent.ACTION_VIEW, Uri.parse(actionUrl)), PendingIntent.FLAG_UPDATE_CURRENT)
//                )
//        }
//    }

//    private fun getBitmapFromUrl(url: String): Bitmap? {
//        return try {
//            Picasso.get().load(url).get()
//        } catch (e: Exception) {
//            null
//        }
//    }



//    private fun isAppInForeground(): Boolean {
//        // Implement your own logic to determine if the app is in the foreground
//        // You can use activity lifecycle callbacks or other mechanisms
//        // Return true if the app is in the foreground, false otherwise
//        // This is a placeholder implementation, please update it with your actual implementation
//        return false
//    }


//    override fun onMessageReceived(remoteMessage: RemoteMessage) { // old one
//        Log.d(ContentValues.TAG, "Notification Received !!!")
//        if(remoteMessage.getNotification() != null){
//            generateNotification(remoteMessage.notification!!.title!!, remoteMessage.notification!!.body!!)
//        }
//    }


//    @SuppressLint("RemoteViewLayout")
//    fun getRemoteView(title: String, message: String): RemoteViews { // removed
//        val remoteView = RemoteViews("com.firebase.myapplication", R.layout.notification)
//
//        remoteView.setTextViewText(R.id.title, title)
//        remoteView.setTextViewText(R.id.message, message)
//        remoteView.setImageViewResource(R.id.app_logo, R.drawable.bebo)
//
//        return remoteView
//    }

//        @RequiresApi(Build.VERSION_CODES.O) // previosly not being used.
    @SuppressLint("UnspecifiedImmutableFlag") // modified
    fun generateNotification(title: String, message: String, image: String?){

        val intent = Intent(this,MainActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)

        val pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT)

        var builder: NotificationCompat.Builder = NotificationCompat.Builder(applicationContext,channelId)
            .setSmallIcon(R.drawable.bebo)
            .setAutoCancel(true)
            .setVibrate(longArrayOf(1000, 1000, 1000, 1000))
            .setOnlyAlertOnce(true)
            .setContentIntent(pendingIntent)

        builder = builder.setContent(getRemoteView(title, message))

        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
//
//
//
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
            val notificationChannel = NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_HIGH)
            notificationManager.createNotificationChannel((notificationChannel))
        }

        notificationManager.notify(0, builder.build())
    }

}
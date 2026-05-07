package com.tabib.alajaeib.api

import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    
    // Authentication
    @POST("api/auth/register")
    suspend fun register(@Body user: Map<String, Any>): Response<Map<String, Any>>
    
    @POST("api/auth/login")
    suspend fun login(@Body credentials: Map<String, String>): Response<Map<String, Any>>
    
    @GET("api/user/profile")
    suspend fun getProfile(@Header("Authorization") token: String): Response<Map<String, Any>>
    
    @PUT("api/user/profile")
    suspend fun updateProfile(
        @Header("Authorization") token: String,
        @Body profile: Map<String, Any>
    ): Response<Map<String, Any>>
    
    // Chat
    @POST("api/chat/send")
    suspend fun sendMessage(
        @Header("Authorization") token: String,
        @Body message: Map<String, Any>
    ): Response<Map<String, Any>>
    
    @GET("api/chat/history/{chatId}")
    suspend fun getChatHistory(
        @Header("Authorization") token: String,
        @Path("chatId") chatId: String
    ): Response<Map<String, Any>>
    
    @GET("api/chat/sessions")
    suspend fun getChatSessions(@Header("Authorization") token: String): Response<Map<String, Any>>
    
    // Medical Files
    @GET("api/file/medical")
    suspend fun getMedicalFile(@Header("Authorization") token: String): Response<Map<String, Any>>
    
    @PUT("api/file/medical")
    suspend fun updateMedicalFile(
        @Header("Authorization") token: String,
        @Body fileData: Map<String, Any>
    ): Response<Map<String, Any>>
    
    @Multipart
    @POST("api/file/upload")
    suspend fun uploadFile(
        @Header("Authorization") token: String,
        @Part file: okhttp3.MultipartBody.Part,
        @Part("type") type: okhttp3.RequestBody
    ): Response<Map<String, Any>>
    
    // AI Agents
    @GET("api/agents")
    suspend fun getAgents(@Header("Authorization") token: String): Response<Map<String, Any>>
    
    // Subscriptions
    @GET("api/subscription/plans")
    suspend fun getSubscriptionPlans(@Header("Authorization") token: String): Response<Map<String, Any>>
    
    @POST("api/subscription/subscribe")
    suspend fun subscribe(
        @Header("Authorization") token: String,
        @Body subscription: Map<String, Any>
    ): Response<Map<String, Any>>
    
    @GET("api/subscription/status")
    suspend fun getSubscriptionStatus(@Header("Authorization") token: String): Response<Map<String, Any>>
}

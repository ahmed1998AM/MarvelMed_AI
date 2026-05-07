package com.tabib.alajaeib.model

data class User(
    val id: String = "",
    val email: String = "",
    val name: String = "",
    val age: Int? = null,
    val gender: String? = null,
    val phone: String? = null,
    val medicalFileId: String? = null,
    val subscriptionPlan: String = "free",
    val createdAt: Long = System.currentTimeMillis()
)

data class MedicalFile(
    val id: String = "",
    val userId: String = "",
    val height: Double? = null,
    val weight: Double? = null,
    val bloodType: String? = null,
    val chronicDiseases: List<String> = emptyList(),
    val allergies: List<String> = emptyList(),
    val medications: List<String> = emptyList(),
    val medicalHistory: List<String> = emptyList(),
    val updatedAt: Long = System.currentTimeMillis()
)

data class ChatMessage(
    val id: String = "",
    val chatId: String = "",
    val sender: String = "", // "user" or "agent"
    val content: String = "",
    val agentType: String = "",
    val timestamp: Long = System.currentTimeMillis(),
    val attachments: List<String> = emptyList()
)

data class AIAgent(
    val id: String = "",
    val name: String = "",
    val specialty: String = "",
    val description: String = "",
    val avatarUrl: String = "",
    val isActive: Boolean = true
)

data class Subscription(
    val id: String = "",
    val userId: String = "",
    val plan: String = "", // "free", "gold", "platinum"
    val startDate: Long = System.currentTimeMillis(),
    val endDate: Long = 0,
    val isActive: Boolean = false,
    val paymentMethod: String = ""
)

<script setup>
import { ref, onMounted } from 'vue';

const rules = ref([]);
const newRule = ref({
    listenAddress: '0.0.0.0',
    listenPort: '',
    connectAddress: '127.0.0.1',
    connectPort: ''
});
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const API_URL = '/api/rules'; // Use relative path

const fetchRules = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch rules.');
        }
        rules.value = await response.json();
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        isLoading.value = false;
    }
};

const addRule = async () => {
    if (!newRule.value.listenPort || !newRule.value.connectPort) {
        errorMessage.value = 'Listen port and connect port cannot be empty.';
        return;
    }
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRule.value),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to add rule.');
        }
        successMessage.value = 'Rule added successfully!';
        newRule.value.listenPort = '';
        newRule.value.connectPort = '';
        fetchRules();
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        isLoading.value = false;
    }
};

const deleteRule = async (ruleToDelete) => {
    if (!confirm(`Are you sure you want to delete the rule for ${ruleToDelete.listenAddress}:${ruleToDelete.listenPort}?`)) {
        return;
    }
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    try {
        const response = await fetch(API_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                listenAddress: ruleToDelete.listenAddress,
                listenPort: ruleToDelete.listenPort,
            }),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to delete rule.');
        }
        successMessage.value = 'Rule deleted successfully!';
        fetchRules();
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchRules);
</script>

<template>
    <div class="bg-gray-900 text-white min-h-screen font-sans">
        <div class="container mx-auto p-8">
            <header class="mb-12 text-center">
                <h1 class="text-5xl font-bold text-cyan-400">Netsh Manager</h1>
                <p class="text-gray-400 mt-2">A simple interface to manage Windows port forwarding rules.</p>
            </header>

            <!-- Add Rule Form -->
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg mb-10">
                <h2 class="text-2xl font-semibold mb-6 text-cyan-300">Add New Rule</h2>
                <form @submit.prevent="addRule" class="space-y-6">
                    <div class="p-4 border border-gray-700 rounded-lg">
                        <p class="text-lg font-semibold text-cyan-400 mb-4">Listen (Incoming Connection)</p>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="md:col-span-2">
                                <label for="listenAddress" class="block text-sm font-medium text-gray-300 mb-1">Listen
                                    Address</label>
                                <input v-model="newRule.listenAddress" type="text" id="listenAddress"
                                    class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500">
                                <p class="text-xs text-gray-400 mt-1">IP to listen on. `0.0.0.0` for all IPs.</p>
                            </div>
                            <div>
                                <label for="listenPort" class="block text-sm font-medium text-gray-300 mb-1">Listen
                                    Port</label>
                                <input v-model="newRule.listenPort" type="number" id="listenPort"
                                    class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"
                                    placeholder="e.g., 8080">
                                <p class="text-xs text-gray-400 mt-1">The external port.</p>
                            </div>
                        </div>
                    </div>

                    <div class="p-4 border border-gray-700 rounded-lg">
                        <p class="text-lg font-semibold text-cyan-400 mb-4">Connect (Forward To)</p>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="md:col-span-2">
                                <label for="connectAddress" class="block text-sm font-medium text-gray-300 mb-1">Connect
                                    Address</label>
                                <input v-model="newRule.connectAddress" type="text" id="connectAddress"
                                    class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500">
                                <p class="text-xs text-gray-400 mt-1">IP to forward to (e.g., WSL, container).</p>
                            </div>
                            <div>
                                <label for="connectPort" class="block text-sm font-medium text-gray-300 mb-1">Connect
                                    Port</label>
                                <input v-model="newRule.connectPort" type="number" id="connectPort"
                                    class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"
                                    placeholder="e.g., 3000">
                                <p class="text-xs text-gray-400 mt-1">The internal service port.</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button type="submit" :disabled="isLoading"
                            class="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-md transition duration-300 text-base">
                            {{ isLoading ? 'Adding...' : 'Add Rule' }}
                        </button>
                    </div>
                </form>
            </div>

            <!-- Messages -->
            <div v-if="errorMessage" class="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-md mb-6">
                <strong>Error:</strong> {{ errorMessage }}
            </div>
            <div v-if="successMessage"
                class="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded-md mb-6">
                {{ successMessage }}
            </div>

            <!-- Rules List -->
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-semibold text-cyan-300">Current Rules</h2>
                    <button @click="fetchRules" :disabled="isLoading"
                        class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                        <svg v-if="isLoading" class="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        {{ isLoading ? 'Refreshing...' : 'Refresh' }}
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="border-b border-gray-600">
                            <tr>
                                <th class="p-4">Listen On</th>
                                <th class="p-4">Forward To</th>
                                <th class="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="rules.length === 0">
                                <td colspan="3" class="text-center p-8 text-gray-400">No active port forwarding rules
                                    found.</td>
                            </tr>
                            <tr v-for="rule in rules" :key="`${rule.listenAddress}-${rule.listenPort}`"
                                class="border-b border-gray-700 hover:bg-gray-700/50">
                                <td class="p-4 font-mono">{{ rule.listenAddress }}:{{ rule.listenPort }}</td>
                                <td class="p-4 font-mono">{{ rule.connectAddress }}:{{ rule.connectPort }}</td>
                                <td class="p-4">
                                    <button @click="deleteRule(rule)" :disabled="isLoading"
                                        class="bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white font-bold py-1 px-3 rounded-md text-sm transition duration-300">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <footer class="text-center mt-12 text-gray-500 text-sm">
                <p>Powered by Node.js, Vue 3 & Tailwind CSS.</p>
            </footer>
        </div>
    </div>
</template>
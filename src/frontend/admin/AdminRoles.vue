<template lang="pug">
v-layout(row)
	v-flex(lg6).mr-5
		v-layout(column)
			h2 Roles
			v-data-table.elevation-1(:items="roles" item-key="_id")
				template(slot="headers" slot-scope="props")
					tr
						th(align="left") Name
						th(align="right") Actions
				template(slot="items" slot-scope="props")
					tr
						td.text-xs-left {{ props.item.name }}
						td.text-xs-right
							v-icon.mr-2(small @click="editRole(props.item)" :disabled="editVisible") edit
							v-icon(small @click="showDeleteDialog(props.item)" :disabled="editVisible") delete
			v-btn.mx-0(@click="createRole" color="success") New role
			v-btn.mx-0(@click="refreshDiscordRoles") Refresh Discord roles
	v-flex(lg6)
		v-layout(column v-if="editVisible")
			v-form(v-model="editValid")
				h2 {{ editHeader }}
				v-text-field(label="Name" v-model="role.name" :rules="[rules.required, rules.duplicate]")
				v-select(label="Discord role" v-model="role.discordRole" :items="discordRoles" item-text="name" item-value="id")
				h3 Player
				v-checkbox(label="Is player" v-model="role.permissions.player")
				h3 Referee
				v-checkbox(label="Is referee" v-model="role.permissions.referee")
				h3 Mappooler
				v-checkbox(label="Is mappooler" v-model="role.permissions.mappooler")
				v-data-table.elevation-1(v-if="role.permissions.mappooler" :items="tiers" item-key="_id" v-model="role.permissions.mappoolerTiers" select-all)
					template(slot="headers" slot-scope="props")
						tr
							th
								v-checkbox(:input-value="props.all" primary hide-details @click.native="toggleMappoolerTiers")
							th(align="left") Name
					template(slot="items" slot-scope="props")
						tr
							td
								v-checkbox(v-model="props.selected" primary hide-details)
							td.text-xs-left {{ props.item.name }}
				h3 Headpooler
				v-checkbox(label="Is headpooler" v-model="role.permissions.headpooler")
				h3 Admin
				v-checkbox(label="Edit availability" v-model="role.permissions.admin.availability")
				v-checkbox(label="Bracket setup" v-model="role.permissions.admin.bracket")
				v-checkbox(label="Scheduling" v-model="role.permissions.admin.lobbies")
				v-checkbox(label="Edit mappoolers" v-model="role.permissions.admin.mappoolers")
				v-checkbox(label="Edit players" v-model="role.permissions.admin.players")
				v-checkbox(label="Edit registrations" v-model="role.permissions.admin.registrations")
				v-checkbox(label="Edit roles" v-model="role.permissions.admin.roles")
				v-checkbox(label="Edit tiers" v-model="role.permissions.admin.tiers")
				v-checkbox(label="Edit timeslots" v-model="role.permissions.admin.timeslots")
				v-btn(@click="cancel") Cancel
				v-btn(@click="saveRole" color="success" :disabled="!editValid || isSuperuser") Save
	v-dialog(v-model="deleteDialogVisible" max-width="300")
		v-card
			v-card-title.headline Delete this role?
			v-card-text This action is not reversible!
			v-card-actions
				v-spacer
				v-btn(flat @click="deleteDialogVisible = false") Cancel
				v-btn(flat @click="deleteRole" color="error") Delete
</template>

<script>
export default {
	name: 'AdminRoles',
	data: function (){
		return {
			editVisible: false,
			newRole: false,
			editValid: false,
			deleteDialogVisible: false,
			deleteRoleId: '',
			role: {
				_id: '',
				name: 'superuser',
				discordRole: '',
				permissions: {
					player: true,
					referee: true,
					mappooler: true,
					mappoolerTiers: [],
					headpooler: true,
					admin: {
						availability: true,
						bracket: true,
						lobbies: true,
						mappoolers: true,
						players: true,
						registrations: true,
						roles: true,
						spreadsheets: true,
						tiers: true,
						timeslots: true
					}
				}
			},
			rules: {
				required: value => !!value || 'Required',
				duplicate: value => {
					for (let i = 0; i < this.roles.length; i++) {
						if (value == this.roles[i].name && (this.newRole || (!this.newRole && this.role._id != this.roles[i]._id))) {
							return 'Name duplicate'
						}
					}
					return true
				}
			}
		}
	},
	computed: {
		roles() {
			return this.$store.state.roles
		},
		discordRoles() {
			return this.$store.state.discordroles
		},
		tiers() {
			return this.$store.state.tiers
		},
		editHeader() {
			return this.newRole ? 'New role' : 'Edit role'
		},
		isSuperuser() {
			return this.role.name == 'superuser'
		}
	},
	methods: {
		refreshDiscordRoles() {
			this.axios.post('/api/discordroles')
			.then((result) => {
				this.$store.dispatch('getDiscordRoles')
			})
			.catch((err) => {
				console.log(err)
			})
		},
		createRole() {
			this.newRole = true
			this.role = {
				name: '',
				discordRole: null,
				permissions: {
					player: false,
					referee: false,
					mappooler: false,
					mappoolerTiers: [],
					headpooler: false,
					admin: {
						availability: false,
						bracket: false,
						lobbies: false,
						mappoolers: false,
						players: false,
						registrations: false,
						roles: false,
						tiers: false,
						timeslots: false
					}
				}
			}
			this.editVisible = true
		},
		editRole(role) {
			this.role = role
			this.newRole = false
			this.editVisible = true
		},
		saveRole() {
			if (this.editValid) {
				if (!this.newRole) {
					this.axios.put('/api/roles/' + this.role._id, {
						role: this.role
					})
					.then((result) => {
						this.editVisible = false
						this.$store.dispatch('getRoles')
					})
					.catch((err) => {
						console.log(err)
					})
				} else {
					this.axios.post('/api/roles', {
						role: this.role
					})
					.then((result) => {
						this.editVisible = false
						this.$store.dispatch('getRoles')
					})
					.catch((err) => {
						console.log(err)
					})
				}
			}
		},
		showDeleteDialog(role) {
			this.deleteRoleId = role._id
			this.deleteDialogVisible = true
		},
		deleteRole() {
			this.deleteDialogVisible = false
			this.axios.delete('/api/roles/' + this.deleteRoleId)
			.then((result) => {
				this.$store.dispatch('getRoles')
			})
			.catch((err) => {
				console.log(err)
			})
		},
		cancel() {
			this.editVisible = false
		},
		toggleMappoolerTiers() {
			if (this.role.permissions.mappoolerTiers.length)
				this.role.permissions.mappoolerTiers = []
			else
				this.role.permissions.mappoolerTiers = this.tiers.slice()
		}
	},
	watch: {
		'role.permissions.mappooler': function (newValue, oldValue) {
			if (newValue) {
				this.role.permissions.headpooler = false
			}
		},
		'role.permissions.headpooler': function (newValue, oldValue) {
			if (newValue) {
				this.role.permissions.mappooler = false
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
</style>
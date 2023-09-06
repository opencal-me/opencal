import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type ActivityKeySpecifier = ('address' | 'addressPlaceName' | 'coordinates' | 'descriptionHtml' | 'durationSeconds' | 'end' | 'googleEventId' | 'id' | 'isOwnedByViewer' | 'joinUrl' | 'location' | 'name' | 'openings' | 'owner' | 'reservations' | 'shareUrl' | 'start' | 'storyImageUrl' | 'tags' | 'url' | ActivityKeySpecifier)[];
export type ActivityFieldPolicy = {
	address?: FieldPolicy<any> | FieldReadFunction<any>,
	addressPlaceName?: FieldPolicy<any> | FieldReadFunction<any>,
	coordinates?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionHtml?: FieldPolicy<any> | FieldReadFunction<any>,
	durationSeconds?: FieldPolicy<any> | FieldReadFunction<any>,
	end?: FieldPolicy<any> | FieldReadFunction<any>,
	googleEventId?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isOwnedByViewer?: FieldPolicy<any> | FieldReadFunction<any>,
	joinUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	location?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	openings?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	reservations?: FieldPolicy<any> | FieldReadFunction<any>,
	shareUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	start?: FieldPolicy<any> | FieldReadFunction<any>,
	storyImageUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	tags?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ConvertGoogleEventPayloadKeySpecifier = ('activity' | 'clientMutationId' | 'errors' | 'success' | ConvertGoogleEventPayloadKeySpecifier)[];
export type ConvertGoogleEventPayloadFieldPolicy = {
	activity?: FieldPolicy<any> | FieldReadFunction<any>,
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	success?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CoordinatesKeySpecifier = ('latitude' | 'longitude' | CoordinatesKeySpecifier)[];
export type CoordinatesFieldPolicy = {
	latitude?: FieldPolicy<any> | FieldReadFunction<any>,
	longitude?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CreateActivityPayloadKeySpecifier = ('activity' | 'clientMutationId' | 'success' | CreateActivityPayloadKeySpecifier)[];
export type CreateActivityPayloadFieldPolicy = {
	activity?: FieldPolicy<any> | FieldReadFunction<any>,
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	success?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CreateMobileSubscriptionPayloadKeySpecifier = ('clientMutationId' | 'errors' | 'subscription' | 'success' | CreateMobileSubscriptionPayloadKeySpecifier)[];
export type CreateMobileSubscriptionPayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	subscription?: FieldPolicy<any> | FieldReadFunction<any>,
	success?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CreateReservationPayloadKeySpecifier = ('clientMutationId' | 'errors' | 'reservation' | 'success' | CreateReservationPayloadKeySpecifier)[];
export type CreateReservationPayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	reservation?: FieldPolicy<any> | FieldReadFunction<any>,
	success?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DeleteMobileSubscriptionPayloadKeySpecifier = ('clientMutationId' | 'subject' | 'success' | DeleteMobileSubscriptionPayloadKeySpecifier)[];
export type DeleteMobileSubscriptionPayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	subject?: FieldPolicy<any> | FieldReadFunction<any>,
	success?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GoogleEventKeySpecifier = ('activity' | 'descriptionHtml' | 'durationSeconds' | 'end' | 'id' | 'isOrganizedByViewer' | 'isRecurring' | 'location' | 'start' | 'title' | GoogleEventKeySpecifier)[];
export type GoogleEventFieldPolicy = {
	activity?: FieldPolicy<any> | FieldReadFunction<any>,
	descriptionHtml?: FieldPolicy<any> | FieldReadFunction<any>,
	durationSeconds?: FieldPolicy<any> | FieldReadFunction<any>,
	end?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	isOrganizedByViewer?: FieldPolicy<any> | FieldReadFunction<any>,
	isRecurring?: FieldPolicy<any> | FieldReadFunction<any>,
	location?: FieldPolicy<any> | FieldReadFunction<any>,
	start?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ImageKeySpecifier = ('id' | 'signedId' | 'url' | ImageKeySpecifier)[];
export type ImageFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	signedId?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InputFieldErrorKeySpecifier = ('field' | 'message' | InputFieldErrorKeySpecifier)[];
export type InputFieldErrorFieldPolicy = {
	field?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MobileSubscriberKeySpecifier = ('activities' | 'id' | 'phone' | MobileSubscriberKeySpecifier)[];
export type MobileSubscriberFieldPolicy = {
	activities?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	phone?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MobileSubscriptionKeySpecifier = ('id' | 'subject' | 'subscriber' | MobileSubscriptionKeySpecifier)[];
export type MobileSubscriptionFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	subject?: FieldPolicy<any> | FieldReadFunction<any>,
	subscriber?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('convertGoogleEvent' | 'createActivity' | 'createMobileSubscription' | 'createReservation' | 'deleteMobileSubscription' | 'testMutation' | 'updateUser' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	convertGoogleEvent?: FieldPolicy<any> | FieldReadFunction<any>,
	createActivity?: FieldPolicy<any> | FieldReadFunction<any>,
	createMobileSubscription?: FieldPolicy<any> | FieldReadFunction<any>,
	createReservation?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteMobileSubscription?: FieldPolicy<any> | FieldReadFunction<any>,
	testMutation?: FieldPolicy<any> | FieldReadFunction<any>,
	updateUser?: FieldPolicy<any> | FieldReadFunction<any>
};
export type NodeKeySpecifier = ('id' | NodeKeySpecifier)[];
export type NodeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('activities' | 'activity' | 'activityStatus' | 'announcement' | 'bootedAt' | 'contactEmail' | 'imageBySignedId' | 'mobileSubscriber' | 'mobileSubscription' | 'passwordStrength' | 'reservation' | 'testEcho' | 'user' | 'viewer' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	activities?: FieldPolicy<any> | FieldReadFunction<any>,
	activity?: FieldPolicy<any> | FieldReadFunction<any>,
	activityStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	announcement?: FieldPolicy<any> | FieldReadFunction<any>,
	bootedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	contactEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	imageBySignedId?: FieldPolicy<any> | FieldReadFunction<any>,
	mobileSubscriber?: FieldPolicy<any> | FieldReadFunction<any>,
	mobileSubscription?: FieldPolicy<any> | FieldReadFunction<any>,
	passwordStrength?: FieldPolicy<any> | FieldReadFunction<any>,
	reservation?: FieldPolicy<any> | FieldReadFunction<any>,
	testEcho?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	viewer?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ReservationKeySpecifier = ('activity' | 'createdAt' | 'email' | 'id' | 'name' | 'note' | 'phone' | 'status' | ReservationKeySpecifier)[];
export type ReservationFieldPolicy = {
	activity?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	phone?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SubscriptionKeySpecifier = ('activityStatus' | 'testSubscription' | SubscriptionKeySpecifier)[];
export type SubscriptionFieldPolicy = {
	activityStatus?: FieldPolicy<any> | FieldReadFunction<any>,
	testSubscription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TestModelKeySpecifier = ('birthday' | 'id' | 'name' | TestModelKeySpecifier)[];
export type TestModelFieldPolicy = {
	birthday?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TestMutationPayloadKeySpecifier = ('clientMutationId' | 'errors' | 'model' | 'success' | TestMutationPayloadKeySpecifier)[];
export type TestMutationPayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	model?: FieldPolicy<any> | FieldReadFunction<any>,
	success?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateUserPayloadKeySpecifier = ('clientMutationId' | 'errors' | 'success' | 'user' | UpdateUserPayloadKeySpecifier)[];
export type UpdateUserPayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	success?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('activities' | 'avatarUrl' | 'bio' | 'email' | 'firstName' | 'googleEvents' | 'id' | 'initials' | 'isAdmin' | 'isViewer' | 'lastName' | 'mobileSubscriptions' | 'name' | 'url' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	activities?: FieldPolicy<any> | FieldReadFunction<any>,
	avatarUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	bio?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	firstName?: FieldPolicy<any> | FieldReadFunction<any>,
	googleEvents?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	initials?: FieldPolicy<any> | FieldReadFunction<any>,
	isAdmin?: FieldPolicy<any> | FieldReadFunction<any>,
	isViewer?: FieldPolicy<any> | FieldReadFunction<any>,
	lastName?: FieldPolicy<any> | FieldReadFunction<any>,
	mobileSubscriptions?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	Activity?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ActivityKeySpecifier | (() => undefined | ActivityKeySpecifier),
		fields?: ActivityFieldPolicy,
	},
	ConvertGoogleEventPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ConvertGoogleEventPayloadKeySpecifier | (() => undefined | ConvertGoogleEventPayloadKeySpecifier),
		fields?: ConvertGoogleEventPayloadFieldPolicy,
	},
	Coordinates?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CoordinatesKeySpecifier | (() => undefined | CoordinatesKeySpecifier),
		fields?: CoordinatesFieldPolicy,
	},
	CreateActivityPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CreateActivityPayloadKeySpecifier | (() => undefined | CreateActivityPayloadKeySpecifier),
		fields?: CreateActivityPayloadFieldPolicy,
	},
	CreateMobileSubscriptionPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CreateMobileSubscriptionPayloadKeySpecifier | (() => undefined | CreateMobileSubscriptionPayloadKeySpecifier),
		fields?: CreateMobileSubscriptionPayloadFieldPolicy,
	},
	CreateReservationPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CreateReservationPayloadKeySpecifier | (() => undefined | CreateReservationPayloadKeySpecifier),
		fields?: CreateReservationPayloadFieldPolicy,
	},
	DeleteMobileSubscriptionPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DeleteMobileSubscriptionPayloadKeySpecifier | (() => undefined | DeleteMobileSubscriptionPayloadKeySpecifier),
		fields?: DeleteMobileSubscriptionPayloadFieldPolicy,
	},
	GoogleEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GoogleEventKeySpecifier | (() => undefined | GoogleEventKeySpecifier),
		fields?: GoogleEventFieldPolicy,
	},
	Image?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ImageKeySpecifier | (() => undefined | ImageKeySpecifier),
		fields?: ImageFieldPolicy,
	},
	InputFieldError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InputFieldErrorKeySpecifier | (() => undefined | InputFieldErrorKeySpecifier),
		fields?: InputFieldErrorFieldPolicy,
	},
	MobileSubscriber?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MobileSubscriberKeySpecifier | (() => undefined | MobileSubscriberKeySpecifier),
		fields?: MobileSubscriberFieldPolicy,
	},
	MobileSubscription?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MobileSubscriptionKeySpecifier | (() => undefined | MobileSubscriptionKeySpecifier),
		fields?: MobileSubscriptionFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	Node?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | NodeKeySpecifier | (() => undefined | NodeKeySpecifier),
		fields?: NodeFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	Reservation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ReservationKeySpecifier | (() => undefined | ReservationKeySpecifier),
		fields?: ReservationFieldPolicy,
	},
	Subscription?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SubscriptionKeySpecifier | (() => undefined | SubscriptionKeySpecifier),
		fields?: SubscriptionFieldPolicy,
	},
	TestModel?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TestModelKeySpecifier | (() => undefined | TestModelKeySpecifier),
		fields?: TestModelFieldPolicy,
	},
	TestMutationPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TestMutationPayloadKeySpecifier | (() => undefined | TestMutationPayloadKeySpecifier),
		fields?: TestMutationPayloadFieldPolicy,
	},
	UpdateUserPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateUserPayloadKeySpecifier | (() => undefined | UpdateUserPayloadKeySpecifier),
		fields?: UpdateUserPayloadFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;
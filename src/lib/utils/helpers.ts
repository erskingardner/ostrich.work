import type { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function unixTimeNowInSeconds() {
    return Math.floor(new Date().getTime() / 1000);
}

export function dateTomorrow() {
    return new Date(Date.now() + 3600 * 1000 * 24);
}

export function formattedDate(unixTimestampInSeconds: number): string {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    const date = new Date(unixTimestampInSeconds * 1000);
    return date.toLocaleDateString("en-US", options);
}

export function truncatedBech(bech32: string, length?: number): string {
    return `${bech32.substring(0, length || 9)}...`;
}

export async function copyToClipboard(textToCopy: string) {
    try {
        await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
        console.error("Failed to copy: ", err);
    }
}

export function slugify(string: string): string {
    return string.toLowerCase().replace(/\s/g, "-");
}

export function firstTagValue(event: NDKEvent, tagName: string): string {
    const firstTag = event.getMatchingTags(tagName)[0];
    return firstTag ? firstTag[1] : "";
}

export function mostRecentPostTime(events: NDKEvent[]): string {
    if (events.length > 1) {
        const sortedEvents = sortEventsRevCron(events);
        return dayjs(parseInt(firstTagValue(sortedEvents[0], "published_at")) * 1000).fromNow();
    } else {
        return dayjs(parseInt(firstTagValue(events[0], "published_at")) * 1000).fromNow();
    }
}

export function sortEventsRevCron(events: NDKEvent[]): NDKEvent[] {
    if (events.length > 1) {
        return events.sort(
            (a, b) =>
                parseInt(firstTagValue(b, "published_at")) -
                parseInt(firstTagValue(a, "published_at"))
        );
    } else {
        return events;
    }
}

export function truncatedNpub(user: NDKUser): string {
    return user.npub ? truncatedBech(user.npub) : "";
}

export function displayableName(user: NDKUser): string {
    return user.profile?.name || user.profile?.displayName || truncatedNpub(user);
}

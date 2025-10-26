export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /**
     * @methodtype constructor-method
     * Expects that all Name components are properly masked.
     * Does not try to "fix" masking and wirft daher keine Fehler bei Maskierungsproblemen.
     */
    constructor(other: string[], delimiter?: string) {
        // Kopie übernehmen, damit externe Änderungen am Array nicht intern durchschlagen.
        this.components = other.slice();

        // Falls ein benutzerdefinierter Delimiter übergeben wird, setzen.
        // Sonst Standard '.'.
        this.delimiter = (delimiter !== undefined) ? delimiter : DEFAULT_DELIMITER;
    }

    /**
     * @methodtype get-method
     * Returns a human-readable representation of the Name instance.
     * - Special characters are NOT escaped.
     * - Die Komponenten werden zuerst entmaskiert (also "\" vor Sonderzeichen entfernt).
     * - Dann werden die "rohen" Komponenten mit dem gewünschten Delimiter zusammengefügt.
     *   Achtung: Dieser Delimiter muss nicht dem internen delimiter entsprechen.
     */
    public asString(delimiterChar: string = this.delimiter): string {
        // Schritt 1: interne (maskierte) Komponenten entmaskieren
        const humanParts: string[] = this.components.map(
            (c) => Name.unescapeComponent(c, this.delimiter)
        );

        // Schritt 2: mit gewünschtem Delimiter zusammenfügen
        return humanParts.join(delimiterChar);
    }

    /**
     * @methodtype get-method
     * Returns a machine-readable representation of this Name.
     * "Machine-readable" heißt eindeutig parsebar.
     * Vorgaben:
     * - Als Delimiter wird IMMER DEFAULT_DELIMITER ('.') benutzt.
     * - Als Escape-Zeichen wird IMMER ESCAPE_CHARACTER ('\') benutzt.
     *
     * Ablauf:
     * 1. Aktuelle Komponenten werden entmaskiert (also "roher" Inhalt).
     * 2. Diese rohen Strings werden neu maskiert,
     *    aber diesmal so, dass '.' und '\' (die Standard-Sonderzeichen)
     *    korrekt escaped sind.
     * 3. Join mit '.'.
     */
    public asDataString(): string {
        // 1. Entmaskieren relativ zum internen delimiter.
        const rawParts: string[] = this.components.map(
            (c) => Name.unescapeComponent(c, this.delimiter)
        );

        // 2. Für DEFAULT_DELIMITER neu maskieren.
        const escapedForDefault: string[] = rawParts.map(
            (c) => Name.escapeComponent(c, DEFAULT_DELIMITER)
        );

        // 3. Mit DEFAULT_DELIMITER joinen.
        return escapedForDefault.join(DEFAULT_DELIMITER);
    }

    /**
     * @methodtype get-method
     * Returns the masked component string at index i.
     * Also wirklich der intern gespeicherte (maskierte) Wert.
     */
    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError("index out of range");
        }
        return this.components[i];
    }

    /**
     * @methodtype set-method
     * Sets / replaces component at index i.
     * Erwartet, dass c bereits korrekt maskiert ist für das aktuelle this.delimiter.
     */
    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError("index out of range");
        }
        this.components[i] = c;
    }

    /**
     * @methodtype get-method
     * Returns number of components in this Name.
     */
    public getNoComponents(): number {
        return this.components.length;
    }

    /**
     * @methodtype insert-method
     * Inserts a new (maskierte) Komponente c vor Index i.
     * Gültig sind 0 <= i <= length (am Ende einfügen ist erlaubt).
     * Erwartet, dass c bereits korrekt maskiert ist.
     */
    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new RangeError("index out of range");
        }
        this.components.splice(i, 0, c);
    }

    /**
     * @methodtype append-method
     * Appends a new (maskierte) Komponente c ans Ende.
     * Erwartet, dass c bereits korrekt maskiert ist.
     */
    public append(c: string): void {
        this.components.push(c);
    }

    /**
     * @methodtype remove-method
     * Removes the component at index i.
     */
    public remove(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError("index out of range");
        }
        this.components.splice(i, 1);
    }

    /**
     * @methodtype helper-method
     * Interpretiert einen maskierten Komponenten-String (relativ zu delimiterChar)
     * und liefert den "rohen" Inhalt zurück, ohne Escape-Sequenzen.
     *
     * Regeln laut Aufgabenstellung:
     * - Es gibt nur zwei Sonderzeichen: das Delimiter-Zeichen und ESCAPE_CHARACTER.
     * - Um ein Sonderzeichen literal im Component zu speichern, steht davor ESCAPE_CHARACTER.
     *   Beispiele (bei delimiter='.'):
     *     "Oh\.\.\."  ->  "Oh..."
     *     "\\."       ->  "\."
     *
     * Algorithmus:
     * - Lies Zeichen für Zeichen.
     * - Falls "\" kommt:
     *    - Wenn danach "\" oder der aktuelle delimiter kommt:
     *        dann nimm nur das danach kommende Zeichen wörtlich.
     *        (also '\' + '.' => '.')
     *    - Sonst behalte den '\' als normales Zeichen.
     *      (robuste Fallback-Strategie für "komisch maskierte" Eingaben)
     */
    private static unescapeComponent(masked: string, delimiterChar: string): string {
        let result = "";
        for (let i = 0; i < masked.length; i++) {
            const ch = masked.charAt(i);

            if (ch === ESCAPE_CHARACTER) {
                if (i + 1 < masked.length) {
                    const next = masked.charAt(i + 1);

                    if (next === ESCAPE_CHARACTER || next === delimiterChar) {
                        // "\X" -> literal X, wenn X Sonderzeichen ist
                        result += next;
                        i++; // skip next char
                        continue;
                    }
                }
                // Lone '\' am Ende oder vor Nicht-Sonderzeichen.
                // Dann interpretieren wir '\' als normales Zeichen.
                result += ESCAPE_CHARACTER;
            } else {
                result += ch;
            }
        }
        return result;
    }

    /**
     * @methodtype helper-method
     * Nimmt einen "rohen" Komponenten-String (also entmaskiert)
     * und maskiert ihn so, dass er eindeutig parsebar ist,
     * für ein bestimmtes delimiterChar.
     *
     * Regeln:
     * - delimiterChar muss escaped werden.
     * - ESCAPE_CHARACTER muss escaped werden.
     *
     * Beispiel bei delimiter='.':
     * raw: "Oh..."      -> "Oh\.\.\."
     * raw: "a\b"        -> "a\\b"
     * raw: "a.b\c"      -> "a\.b\\c"
     */
    private static escapeComponent(raw: string, delimiterChar: string): string {
        let result = "";
        for (let i = 0; i < raw.length; i++) {
            const ch = raw.charAt(i);

            if (ch === ESCAPE_CHARACTER || ch === delimiterChar) {
                result += ESCAPE_CHARACTER;
            }

            result += ch;
        }
        return result;
    }
}
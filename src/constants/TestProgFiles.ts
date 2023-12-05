export function getCTestProg() {
    return `#include <stdio.h>

int main()
{
    int i; // Laufvariable i
    float y;

    i=0;
    printf("Hallo!\\n");
    i=i+1;
    printf("Hallo 1!\\n");
    i=i+1;
    printf("Hallo 2!\\n");
    i=i+1;
    printf("Hallo 3!\\n");
    y = 12 + 4 % 3 * 7 / 8;
    return 0;
}`;
}

export function getJavaTestProg() {
    return `public class HelloWorld {
    public static void main(String[] args) {

        System.out.println("Java said, Hello, World!");
        int i = 1;
        System.out.println(i);
        i++;
        System.out.println(i);
        i++;
        System.out.println(i);
        i++;
        System.out.println(i);

    }
}`;
}

export function getPythonTestProg() {
    return `print("Python said, Hello World!")
i = 1
print(i)
i += 1
print(i)
i += 1
print(i)
i += 1
print(i)`;
}
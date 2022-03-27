all:main

main: main.o matrix.o
	gcc main.o matrix.o -o out

main.o: main.c
	gcc -c main.c

matrix.o: matrix.c
	gcc -c matrix.c

clean:
	rm *.o out
